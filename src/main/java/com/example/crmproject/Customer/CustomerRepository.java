package com.example.crmproject.Customer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long>, JpaSpecificationExecutor<Customer> {

    Optional<Customer> findByCustomerNo(String customerNo);
    Optional<Customer> findById(Long id);

    boolean existsByCustomerNo(String customerNo);
    boolean existsByCustomerNoAndIdNot(String customerNo, Long id);
    boolean existsByEmail(String email);
    boolean existsByEmailAndIdNot(String email, Long id);
    boolean existsByPhone(String phone);
    boolean existsByPhoneAndIdNot(String phone, Long id);

    List<Customer> findTop10ByCompanyNameContainingIgnoreCaseOrderByCompanyNameAsc(String q);
    List<Customer> findTop5ByOrderByUpdatedAtDesc();

    boolean existsByCompanyNameIgnoreCase(String companyName);
}
