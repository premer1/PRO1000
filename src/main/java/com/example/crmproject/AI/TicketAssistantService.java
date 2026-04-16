package com.example.crmproject.AI;

import com.example.crmproject.Common.ApiException;
import com.example.crmproject.Tickets.Tickets;
import com.example.crmproject.Tickets.TicketsService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

@Service
public class TicketAssistantService {

    private static final Logger log = LoggerFactory.getLogger(TicketAssistantService.class);

    private static final String SYSTEM_PROMPT = """
            You are a CRM ticket assistant.
            Reply with valid JSON only.
            Return keys: summary, suggestedPriority, suggestedCategory, suggestedReply.
            suggestedPriority must be one of LOW, MEDIUM, HIGH, CRITICAL.
            Keep the answer concise and useful for a support team.
            """;

    private final TicketsService ticketsService;
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final String aiBaseUrl;
    private final String aiApiKey;
    private final String aiModel;

    public TicketAssistantService(
            TicketsService ticketsService,
            @Value("${app.ai.base-url}") String aiBaseUrl,
            @Value("${app.ai.api-key}") String aiApiKey,
            @Value("${app.ai.model}") String aiModel
    ) {
        this.ticketsService = ticketsService;
        this.objectMapper = new ObjectMapper();
        this.aiBaseUrl = aiBaseUrl;
        this.aiApiKey = aiApiKey;
        this.aiModel = aiModel;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
    }

    public TicketAssistantResponse analyzeTicket(Long ticketId) {
        Tickets ticket = ticketsService.getEntity(ticketId);

        if (StringUtils.hasText(aiApiKey)) {
            try {
                return requestModelAnalysis(ticket);
            } catch (Exception ex) {
                log.warn("AI provider request failed for ticket {}. Falling back to heuristic assistant. Reason: {}", ticketId, ex.getMessage(), ex);
                return heuristicFallback(ticket, true);
            }
        }

        log.info("AI API key is missing. Falling back to heuristic assistant for ticket {}", ticketId);
        return heuristicFallback(ticket, true);
    }

    private TicketAssistantResponse requestModelAnalysis(Tickets ticket) throws IOException, InterruptedException {
        String payload = """
                {
                  "model": "%s",
                  "response_format": {"type": "json_object"},
                  "messages": [
                    {"role": "system", "content": "%s"},
                    {"role": "user", "content": "%s"}
                  ]
                }
                """.formatted(
                escapeJson(aiModel),
                escapeJson(SYSTEM_PROMPT),
                escapeJson(buildPrompt(ticket))
        );

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(aiBaseUrl + "/chat/completions"))
                .timeout(Duration.ofSeconds(25))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + aiApiKey)
                .POST(HttpRequest.BodyPublishers.ofString(payload))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() < 200 || response.statusCode() >= 300) {
            log.warn("AI provider returned non-success status {} with body: {}", response.statusCode(), truncate(response.body()));
            throw new ApiException(HttpStatus.BAD_GATEWAY, "AI-provider svarte med feil");
        }

        JsonNode contentJson = parseAssistantContent(response.body());
        Tickets.TicketPriority priority = parsePriority(readText(contentJson, "suggestedPriority", "MEDIUM"));
        String category = sanitizeCategory(readText(contentJson, "suggestedCategory", "General"));
        String summary = readText(contentJson, "summary", buildSummary(ticket, category));
        String suggestedReply = readText(contentJson, "suggestedReply", buildReply(ticket, priority, category));

        return new TicketAssistantResponse(
                summary,
                priority,
                category,
                suggestedReply,
                aiModel,
                false
        );
    }

    private TicketAssistantResponse heuristicFallback(Tickets ticket, boolean fallbackUsed) {
        String combinedText = (ticket.getSubject() + " " + ticket.getDescription()).toLowerCase();
        Tickets.TicketPriority priority = determinePriority(combinedText);
        String category = determineCategory(combinedText);
        String summary = buildSummary(ticket, category);
        String suggestedReply = buildReply(ticket, priority, category);

        return new TicketAssistantResponse(
                summary,
                priority,
                category,
                suggestedReply,
                "heuristic-assistant",
                fallbackUsed
        );
    }

    private Tickets.TicketPriority determinePriority(String text) {
        if (containsAny(text, "nede", "kritisk", "stopp", "kan ikke logge inn", "security", "sikkerhet", "betaling feiler")) {
            return Tickets.TicketPriority.CRITICAL;
        }
        if (containsAny(text, "feil", "error", "bug", "integrasjon", "api", "forsinkelse")) {
            return Tickets.TicketPriority.HIGH;
        }
        if (containsAny(text, "spørsmål", "oppsett", "konfigurasjon", "tilgang")) {
            return Tickets.TicketPriority.MEDIUM;
        }
        return Tickets.TicketPriority.LOW;
    }

    private String determineCategory(String text) {
        if (containsAny(text, "faktura", "betaling", "invoice")) {
            return "Billing";
        }
        if (containsAny(text, "logg inn", "passord", "bruker", "tilgang")) {
            return "Access";
        }
        if (containsAny(text, "api", "integrasjon", "webhook", "sync")) {
            return "Integration";
        }
        if (containsAny(text, "bug", "feil", "crash", "nede")) {
            return "Bug";
        }
        if (containsAny(text, "pris", "tilbud", "demo")) {
            return "Sales";
        }
        return "General";
    }

    private String buildSummary(Tickets ticket, String category) {
        return "Ticketen gjelder " + category.toLowerCase() + " for " + ticket.getCompanyName()
                + ". Hovedproblemet er \"" + ticket.getSubject() + "\" og bør følges opp med konkret statusoppdatering til kunden.";
    }

    private String buildReply(Tickets ticket, Tickets.TicketPriority priority, String category) {
        return """
                Hei %s,

                Takk for at du meldte inn saken om "%s". Vi har registrert ticketen som %s med kategori %s, og teamet vårt følger den opp videre.

                Neste steg fra vår side er å gjennomgå detaljene og komme tilbake til deg med en konkret oppdatering så snart vi har mer informasjon.

                Vennlig hilsen
                CRM support
                """.formatted(ticket.getContactName(), ticket.getSubject(), priority.name().toLowerCase(), category);
    }

    private boolean containsAny(String text, String... keywords) {
        for (String keyword : keywords) {
            if (text.contains(keyword)) {
                return true;
            }
        }
        return false;
    }

    private String buildPrompt(Tickets ticket) {
        return """
                Ticket subject: %s
                Ticket description: %s
                Company: %s
                Contact: %s
                Current status: %s
                Current priority: %s
                Current category: %s
                """.formatted(
                ticket.getSubject(),
                ticket.getDescription(),
                ticket.getCompanyName(),
                ticket.getContactName(),
                ticket.getStatus(),
                ticket.getPriority(),
                ticket.getCategory()
        );
    }

    private Tickets.TicketPriority parsePriority(String value) {
        try {
            return Tickets.TicketPriority.valueOf(value.trim().toUpperCase());
        } catch (Exception ex) {
            return Tickets.TicketPriority.MEDIUM;
        }
    }

    private String sanitizeCategory(String value) {
        if (!StringUtils.hasText(value)) {
            return "General";
        }
        return value.trim();
    }

    private JsonNode parseAssistantContent(String responseBody) {
        try {
            JsonNode root = objectMapper.readTree(responseBody);
            JsonNode choices = root.path("choices");
            if (!choices.isArray() || choices.isEmpty()) {
                throw new ApiException(HttpStatus.BAD_GATEWAY, "Klarte ikke å lese AI-svar");
            }

            JsonNode message = choices.get(0).path("message");
            String content = extractMessageContent(message);
            if (!StringUtils.hasText(content)) {
                throw new ApiException(HttpStatus.BAD_GATEWAY, "Klarte ikke å lese AI-svar");
            }

            String normalized = stripCodeFences(content.trim());
            return objectMapper.readTree(normalized);
        } catch (JsonProcessingException ex) {
            log.warn("AI provider returned content that could not be parsed as JSON. Body: {}", truncate(responseBody));
            throw new ApiException(HttpStatus.BAD_GATEWAY, "Klarte ikke å lese AI-svar");
        }
    }

    private String extractMessageContent(JsonNode message) {
        JsonNode contentNode = message.path("content");
        if (contentNode.isTextual()) {
            return contentNode.asText();
        }

        if (contentNode.isArray()) {
            StringBuilder builder = new StringBuilder();
            for (JsonNode item : contentNode) {
                if (item.has("text") && item.get("text").isTextual()) {
                    builder.append(item.get("text").asText());
                }
            }
            return builder.toString();
        }

        return null;
    }

    private String readText(JsonNode node, String field, String fallback) {
        JsonNode value = node.path(field);
        if (value.isTextual() && StringUtils.hasText(value.asText())) {
            return value.asText();
        }
        return fallback;
    }

    private String stripCodeFences(String value) {
        if (value.startsWith("```")) {
            int firstLineBreak = value.indexOf('\n');
            int lastFence = value.lastIndexOf("```");
            if (firstLineBreak > -1 && lastFence > firstLineBreak) {
                return value.substring(firstLineBreak + 1, lastFence).trim();
            }
        }
        return value;
    }

    private String escapeJson(String value) {
        return value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n");
    }

    private String truncate(String value) {
        if (value == null) {
            return "";
        }
        if (value.length() <= 800) {
            return value;
        }
        return value.substring(0, 800) + "...";
    }
}
