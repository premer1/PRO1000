package com.example.crmproject.Tickets;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.Date;
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

    public Tickets addTickets(Tickets ticket) {
        return repo.save(ticket);
    }

    public Tickets updateTickets(Tickets ticket) {
        return repo.save(ticket);
    }

    @GetMapping("/{id}")
    public Tickets getOne(@PathVariable Long id) {
        return repo.findById(id).orElseThrow();
    }

    public Tickets getByTicketNo(Long ticketNo) {
        return repo.findByTicketNo(ticketNo)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Fant ikke saksnummer: " + ticketNo
                ));
    }

    public Page<Tickets> search(String q, Pageable pageable) {
        if (q == null || q.isBlank()) {
            return repo.findAll(pageable);
        }
        return repo.findByCompanyNameContainingIgnoreCaseOrPhoneContainingIgnoreCaseOrEmailContainingIgnoreCase
                (q, q, q, pageable);
    }

    public Tickets create(Tickets.CreateTicketRequest req) {
        Tickets t = new Tickets();
        t.setDescription(req.description());
        t.setCompanyName(req.companyName());
        t.setEmail(req.email());
        t.setPhone(req.phone());

        Long nextNo = repo.findMaxTicketNo() + 1;
        t.setTicketNo(nextNo);

        t.setStatus(String.valueOf(Tickets.TicketStatus.OPEN));

        return repo.save(t);
    }

}
