package com.example.crmproject.Tickets;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class TicketsService {
    private final TicketsRepository repo;

    public TicketsService(TicketsRepository repo) {
        this.repo = repo;
    }

    public Tickets create(Tickets.CreateTicketRequest req) {
        Tickets t = new Tickets();
        long nextTicketNo = repo.findMaxTicketNo() + 1;
        t.setDescription(req.description());
        t.setCompanyName(req.companyName());
        t.setContactName(req.contactName());
        t.setSubject(req.subject());
        t.setEmail(req.email());
        t.setPhone(req.phone());
        t.setTicketNo(nextTicketNo);
        t.setCreated(Instant.now());
        t.setStatus(req.status());

        return repo.save(t);
    }

    public List<Tickets> findAll() {
        return repo.findAll();
    }

    public Tickets getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
    }

    public Tickets updateStatus(Long id, Tickets.TicketStatus status) {
        Tickets ticket = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        ticket.setStatus(status);
        ticket.setUpdatedLast(Instant.now());
        return repo.save(ticket);
    }

    public long countTicketsByStatus(Tickets.TicketStatus status) {
        return repo.countByStatus(status);
    }

    public long countNotClosedTickets() {
        return repo.countByStatusNot(Tickets.TicketStatus.CLOSED);
    }

}