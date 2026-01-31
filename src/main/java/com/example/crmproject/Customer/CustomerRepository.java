package com.example.crmproject.Customer;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Optional<Customer> findByCustomerNo(Long customerNo);

    boolean existsByCustomerNo(Long customerNo);
}
