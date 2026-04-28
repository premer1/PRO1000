package com.example.crmproject.AI;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai/tickets")
public class TicketAssistantController {

    private final TicketAssistantService service;

    public TicketAssistantController(TicketAssistantService service) {
        this.service = service;
    }

    @PostMapping("/{ticketId}/assistant")
    public TicketAssistantResponse analyzeTicket(@PathVariable Long ticketId) {
        return service.analyzeTicket(ticketId);
    }
}
