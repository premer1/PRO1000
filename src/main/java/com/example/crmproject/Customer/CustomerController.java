package com.example.crmproject.Customer;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "http://localhost:5173", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT})
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

    @PutMapping("/{id}")
    public Customer update(@PathVariable Long id, @RequestBody Customer customer) {
        return service.update(id, customer);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleValidation(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", ex.getMessage()));
    }
}
