package com.example.crmproject.Tickets;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
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
    public List<TicketResponse> findAll(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Tickets.TicketStatus status,
            @RequestParam(required = false) Tickets.TicketPriority priority,
            @RequestParam(required = false) Long customerId) {
        return service.findAll(query, status, priority, customerId);
    }

    @GetMapping("/{id}")
    public TicketResponse getById(@PathVariable Long id) {
        return service.getById(id);
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
    @ResponseStatus(HttpStatus.CREATED)
    public TicketResponse create(@Valid @RequestBody TicketRequest req) {
        return service.create(req);
    }

    @PutMapping("/{id}")
    public TicketResponse update(@PathVariable Long id, @Valid @RequestBody TicketRequest request) {
        return service.update(id, request);
    }

    public record UpdateTicketStatusRequest(Tickets.TicketStatus status) {}

    @PatchMapping("/{id}/status")
    public TicketResponse updateStatus(@PathVariable Long id, @RequestBody UpdateTicketStatusRequest request) {
        return service.updateStatus(id, request.status());
    }
}
