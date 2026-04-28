package com.example.crmproject.Customer;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService service;
    private final CustomerRepository repo;

    public CustomerController(CustomerService service, CustomerRepository repo) {
        this.service = service;
        this.repo = repo;
    }

    @GetMapping
    public Page<CustomerResponse> getCustomers(
            @RequestParam(required = false) String query,
            @PageableDefault(size = 10, sort = "companyName", direction = Sort.Direction.ASC) Pageable pageable) {
        return service.getCustomers(query, pageable);
    }

    @GetMapping("/lookup")
    public List<CustomerResponse> getCustomerLookup() {
        return service.getAll();
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

    @GetMapping("/{id}")
    public CustomerResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CustomerResponse create(@RequestBody @Valid CustomerRequest customer) {
        return service.create(customer);
    }

    @PutMapping("/{id}")
    public CustomerResponse update(@PathVariable Long id, @RequestBody @Valid CustomerRequest customer) {
        return service.update(id, customer);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
