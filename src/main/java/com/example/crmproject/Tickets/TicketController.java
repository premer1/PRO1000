package com.example.crmproject.Tickets;

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
    public Page<Tickets> list(
            @RequestParam(required = false) String q,
            @PageableDefault(size = 20) Pageable pageable
    ) {
        return service.search(q, pageable);
    }

    @GetMapping("/{id:\\d+}")
    public Tickets get(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping("/suggest")
    public List<String> suggest(@RequestParam String q) {
        return service.suggestCompanyNames(q);
    }

    @GetMapping("/by-ticket-no/{ticketNo}")
    public Tickets byTicketNo(@PathVariable Long ticketNo) {
        return service.getByTicketNo(ticketNo);
    }

    @PostMapping
    public Tickets create(@RequestBody Tickets.CreateTicketRequest req) {
        return service.create(req);
    }

    public record UpdateStatusRequest(Tickets.TicketStatus status) {}

    @PutMapping("/{ticketNo}/status")
    public Tickets updateStatus(@PathVariable long ticketNo,
                                @RequestBody UpdateStatusRequest req) {
        return service.updateStatus(ticketNo, req);
    }
    
}

