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
        validateCustomerNo(customer.getCustomerNo());
        if (repo.existsByCustomerNo(customer.getCustomerNo())) {
            throw new IllegalArgumentException("Kundenummeret eksisterer allerede");
        }
        return repo.save(customer);
    }
    public Customer getByCustomerNo(String customerNo) {
        return repo.findByCustomerNo(customerNo)
                .orElseThrow(() -> new IllegalArgumentException("Fant ikke kundenummer med kundenummer " + customerNo));
    }
    public Page<Customer> getCustomers(Pageable pageable) {
        return repo.findAll(pageable);
    }

    public Customer update(Long id, Customer input) {
        Customer existing = repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Fant ikke kunde med id " + id));

        validateCustomerNo(input.getCustomerNo());

        if (repo.existsByCustomerNoAndIdNot(input.getCustomerNo(), id)) {
            throw new IllegalArgumentException("Kundenummeret eksisterer allerede");
        }
        if (repo.existsByEmailAndIdNot(input.getEmail(), id)) {
            throw new IllegalArgumentException("E-postadressen eksisterer allerede");
        }
        if (repo.existsByPhoneAndIdNot(input.getPhone(), id)) {
            throw new IllegalArgumentException("Telefonnummeret eksisterer allerede");
        }

        existing.setCustomerNo(input.getCustomerNo());
        existing.setCompanyName(input.getCompanyName());
        existing.setFirstName(input.getFirstName());
        existing.setLastName(input.getLastName());
        existing.setEmail(input.getEmail());
        existing.setPhone(input.getPhone());

        return repo.save(existing);
    }

    private void validateCustomerNo(String customerNo) {
        try {
            int customerNoAsInt = Integer.parseInt(customerNo);
            if (customerNoAsInt < 10000) {
                throw new IllegalArgumentException("Kundenummerserien starter på 10000");
            }
        } catch (NumberFormatException ex) {
            throw new IllegalArgumentException("Kundenummer må være et gyldig tall");
        }
    }

}
