package com.example.crmproject.Tickets;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/api/v1/tickets")
public class TicketController {

    private final TicketsService service;

    public TicketController(TicketsService service) {
        this.service = service;
    };

    @GetMapping
    public List<Tickets> findAll() {
        return service.findAll();
    }

    @GetMapping("/{ticketNo}")
    public Tickets getByTicketNo(@PathVariable Long ticketNo) {
        return service.getByTicketNo(ticketNo);
    }

    @GetMapping("/count")
    public long countTicketsByStatus(@RequestParam Tickets.TicketStatus status) {
        return service.countTicketsByStatus(status);
    }

    @GetMapping("/count/not-closed")
    public long countNotClosed() {
        return service.countNotClosedTickets();
    }

    @PostMapping
    public Tickets create(@Valid @RequestBody Tickets.CreateTicketRequest req) {
        return service.create(req);
    }

    public record UpdateTicketStatusRequest(Tickets.TicketStatus status) {
    }

    @PutMapping("/{ticketNo}")
    public Tickets updateStatus(@PathVariable Long ticketNo, @RequestBody UpdateTicketStatusRequest request) {
        return service.updateStatus(ticketNo, request.status());
    }


}

