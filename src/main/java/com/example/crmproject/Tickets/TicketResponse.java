package com.example.crmproject.Tickets;

import java.time.Instant;

public record TicketResponse(
        Long id,
        Long ticketNo,
        String subject,
        String description,
        String contactName,
        String companyName,
        String email,
        String phone,
        Tickets.TicketStatus status,
        Tickets.TicketPriority priority,
        String category,
        Long customerId,
        String customerName,
        Instant created,
        Instant updatedLast,
        Instant closedAt
) {
}
