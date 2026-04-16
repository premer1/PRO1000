package com.example.crmproject.Dashboard;

import com.example.crmproject.Tickets.Tickets;

import java.time.Instant;

public record DashboardRecentTicket(
        Long id,
        Long ticketNo,
        String subject,
        String companyName,
        Tickets.TicketStatus status,
        Tickets.TicketPriority priority,
        Instant updatedLast
) {
}
