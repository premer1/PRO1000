package com.example.crmproject.Tickets;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TicketsService {
    private final TicketsRepository repo;

    public TicketsService(TicketsRepository repo) {
        this.repo = repo;
    }

    public List<Tickets> getAll() {
        return repo.findAll();
    }

    public Tickets create(Tickets ticket) {
        return repo.save(ticket);
    }

    public Tickets getByTicketNo(Long ticketNo) {
        return repo.findByTicketNo(ticketNo)
                .orElseThrow(() -> new IllegalArgumentException("Fant ikke saksnummer: " + ticketNo));
    }
}
