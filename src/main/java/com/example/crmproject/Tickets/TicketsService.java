package com.example.crmproject.Tickets;

import com.example.crmproject.Customer.Customer;
import com.example.crmproject.Customer.CustomerRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
public class TicketsService {
    private final TicketsRepository repo;
    private final CustomerRepository customerRepo;

    public TicketsService(TicketsRepository repo, CustomerRepository customerRepo) {
        this.repo = repo;
        this.customerRepo = customerRepo;
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

    public List<String> suggestCompanyNames(String q) {
        if (q == null || q.trim().length() < 2) return List.of();

        return customerRepo
                .findTop10ByCompanyNameContainingIgnoreCaseOrderByCompanyNameAsc(q.trim())
                .stream()
                .map(Customer::getCompanyName)
                .distinct()
                .toList();
    }

    public Tickets getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket ikke funnet: " + id));
    }
}
