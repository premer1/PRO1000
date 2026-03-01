package com.example.crmproject.Tickets;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/api/v1/tickets")
public class TicketController {

    private final TicketsService service;

    public TicketController(TicketsService service) {
        this.service = service;
    }

    @GetMapping
    public Page<Tickets> findAll(Pageable pageable) {
        return service.findAll(pageable);
    }
    @PostMapping
    public Tickets create(@Valid @RequestBody Tickets.CreateTicketRequest req) {
        return service.create(req);
    }
}

