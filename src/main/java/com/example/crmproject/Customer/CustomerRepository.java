package com.example.crmproject.Customer;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Optional<Customer> findByCustomerNo(String customerNo);

    boolean existsByCustomerNo(String customerNo);
}
