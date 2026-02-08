package com.example.crmproject.TicketsType;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class TicketsService {
    private final TicketsRepository repo;

    public TicketsService(TicketsRepository repo) {
        this.repo = repo;
    }

    public List<TicketsType> getAll() {
        return repo.findAll();
    }

    public TicketsType addTickets(TicketsType ticket) {
        return repo.save(ticket);
    }

    public TicketsType updateTickets(TicketsType ticket) {
        return repo.save(ticket);
    }

    @GetMapping("/{id}")
    public TicketsType getOne(@PathVariable Long id) {
        return repo.findById(id).orElseThrow();
    }

    public TicketsType getByTicketNo(Long ticketNo) {
        return repo.findByTicketNo(ticketNo)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Fant ikke saksnummer: " + ticketNo
                ));
    }

    public Page<TicketsType> search(String q, Pageable pageable) {
        if (q == null || q.isBlank()) {
            return repo.findAll(pageable);
        }
        return repo.findByCompanyNameContainingIgnoreCaseOrPhoneContainingIgnoreCaseOrEmailContainingIgnoreCase
                (q, q, q, pageable);
    }


}
