package com.example.crmproject.AI;

import com.example.crmproject.Tickets.Tickets;

public record TicketAssistantResponse(
        String summary,
        Tickets.TicketPriority suggestedPriority,
        String suggestedCategory,
        String suggestedReply,
        String provider,
        boolean fallbackUsed
) {
}
