package com.example.crmproject.TicketsType;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/tickets")
public class TicketController {
    private final TicketsService service;

    public TicketController(TicketsService service) {this.service = service; }

    @GetMapping
    public Page<TicketsType> list(
            @RequestParam(required = false) String q,
            @PageableDefault(size = 20) Pageable pageable
    ) {
        return service.search(q, pageable);
    }

    @GetMapping("/{id}")
    public TicketsType getOne(@PathVariable Long id) {
        return service.getOne(id);
    }

    @GetMapping("/by-ticket-no/{ticketNo}")
    public TicketsType byTicketNo(@PathVariable Long ticketNo) {
        return service.getByTicketNo(ticketNo);
    }

    @PostMapping
    public ResponseEntity<TicketsType> addTicket(@RequestBody TicketsType tickets) {
        TicketsType created = service.addTickets(tickets);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

};