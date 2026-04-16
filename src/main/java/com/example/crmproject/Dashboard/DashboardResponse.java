package com.example.crmproject.Dashboard;

import java.util.List;

public record DashboardResponse(
        long totalCustomers,
        long activeCustomers,
        long totalTickets,
        long openTickets,
        long inProgressTickets,
        long waitingTickets,
        long closedTickets,
        List<DashboardRecentTicket> recentTickets,
        List<DashboardCustomerActivity> recentCustomerActivity
) {
}
