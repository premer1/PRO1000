package com.example.crmproject.Customer;

import com.example.crmproject.Tickets.TicketsRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "http://localhost:5173", methods = {RequestMethod.GET, RequestMethod.POST})
public class CustomerController {

    private final CustomerService service;
    private final CustomerRepository repo;

    public CustomerController(CustomerService service, CustomerRepository repo) {
        this.service = service;
        this.repo = repo;
    }

    @GetMapping
    public Page<Customer> getCustomers(Pageable pageable) {
        return service.getCustomers(pageable);
    }

    @GetMapping("/suggest")
    public List<String> suggest(@RequestParam String q) {
        return repo.findTop10ByCompanyNameContainingIgnoreCaseOrderByCompanyNameAsc(q)
                .stream()
                .map(Customer::getCompanyName)
                .toList();
    }

    @GetMapping("/exists")
    public boolean exists(@RequestParam String companyName) {
        return repo.existsByCompanyNameIgnoreCase(companyName);
    }


    @PostMapping
    public Customer create(@RequestBody Customer customer) {
        return service.create(customer);
    }
}