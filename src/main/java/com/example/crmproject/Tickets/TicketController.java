package com.example.crmproject.Tickets;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/tickets")
public class TicketController {
    private final TicketsService service;

    public TicketController(TicketsService service) {this.service = service; }

    @GetMapping
    public List<Tickets> getTickets() {return service.getAll(); }

    @PostMapping
    public Tickets create(@RequestBody Tickets tickets) { return service.create(tickets); }

    @GetMapping("/{ticketsno}")
    public Tickets byTickets(@PathVariable long ticketsno) { return service.getByTicketNo(ticketsno); }
}
