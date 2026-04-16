package com.example.crmproject.Dashboard;

import com.example.crmproject.Customer.Customer;
import com.example.crmproject.Customer.CustomerRepository;
import com.example.crmproject.Tickets.Tickets;
import com.example.crmproject.Tickets.TicketsRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DashboardService {

    private final CustomerRepository customerRepository;
    private final TicketsRepository ticketsRepository;

    public DashboardService(CustomerRepository customerRepository, TicketsRepository ticketsRepository) {
        this.customerRepository = customerRepository;
        this.ticketsRepository = ticketsRepository;
    }

    @Transactional(readOnly = true)
    public DashboardResponse getDashboard() {
        List<DashboardRecentTicket> recentTickets = ticketsRepository.findTop5ByOrderByUpdatedLastDesc()
                .stream()
                .map(ticket -> new DashboardRecentTicket(
                        ticket.getId(),
                        ticket.getTicketNo(),
                        ticket.getSubject(),
                        ticket.getCompanyName(),
                        ticket.getStatus(),
                        ticket.getPriority(),
                        ticket.getUpdatedLast()
                ))
                .toList();

        List<DashboardCustomerActivity> recentCustomerActivity = customerRepository.findTop5ByOrderByUpdatedAtDesc()
                .stream()
                .map(this::toCustomerActivity)
                .toList();

        return new DashboardResponse(
                customerRepository.count(),
                ticketsRepository.countDistinctCustomersByStatusNot(Tickets.TicketStatus.CLOSED),
                ticketsRepository.count(),
                ticketsRepository.countByStatus(Tickets.TicketStatus.OPEN),
                ticketsRepository.countByStatus(Tickets.TicketStatus.IN_PROGRESS),
                ticketsRepository.countByStatus(Tickets.TicketStatus.WAITING),
                ticketsRepository.countByStatus(Tickets.TicketStatus.CLOSED),
                recentTickets,
                recentCustomerActivity
        );
    }

    private DashboardCustomerActivity toCustomerActivity(Customer customer) {
        List<Tickets> tickets = ticketsRepository.findAllByCustomerId(customer.getId());
        long activeTickets = tickets.stream()
                .filter(ticket -> ticket.getStatus() != Tickets.TicketStatus.CLOSED)
                .count();
        return new DashboardCustomerActivity(
                customer.getId(),
                customer.getCompanyName(),
                customer.getFirstName() + " " + customer.getLastName(),
                customer.getUpdatedAt(),
                activeTickets,
                tickets.size()
        );
    }
}
