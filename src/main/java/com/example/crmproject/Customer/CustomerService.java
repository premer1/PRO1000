package com.example.crmproject.Customer;

import org.springframework.stereotype.Service;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


@Service
public class CustomerService {

    private final CustomerRepository repo;

    public CustomerService(CustomerRepository repo) {
        this.repo = repo;
    }

    public List<Customer> getAll() {
        return (List<Customer>) repo.findAll();
    }

    // Her legges inn validering av kunder og søking på kunder

    public Customer create(Customer customer) {

        if (customer.getCustomerNo() < 10000) {
            throw new IllegalArgumentException("Kundenummerserien starter på 10000");
        }
        if (repo.existsByCustomerNo(customer.getCustomerNo())) {
            throw new IllegalArgumentException("Kundenummeret eksisterer allerede");
        }
        return repo.save(customer);
    }
    public Customer getByCustomerNo(long customerNo) {
        return repo.findByCustomerNo(customerNo)
                .orElseThrow(() -> new IllegalArgumentException("Fant ikke kundenummer med kundenummer " + customerNo));
    }
    public Page<Customer> getCustomers(Pageable pageable) {
        return repo.findAll(pageable);
    }

}