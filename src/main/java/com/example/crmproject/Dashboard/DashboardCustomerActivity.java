package com.example.crmproject.Dashboard;

import java.time.Instant;

public record DashboardCustomerActivity(
        Long id,
        String companyName,
        String contactName,
        Instant updatedAt,
        long activeTickets,
        long totalTickets
) {
}
