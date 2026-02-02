package com.example.crmproject.Customer;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService service;

    public CustomerController(CustomerService service) {
        this.service = service;
    }

    @GetMapping
    public Page<Customer> getCustomers(Pageable pageable) {
        return service.getCustomers(pageable);
    }


    @PostMapping
    public Customer create(@RequestBody Customer customer) {
        return service.create(customer);
    }
}
