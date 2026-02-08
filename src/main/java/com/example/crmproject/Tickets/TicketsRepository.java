package com.example.crmproject.TicketsType;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TicketsRepository extends JpaRepository<TicketsType, String> {
    Optional<TicketsType> findById(Long id);
    Optional<TicketsType> findByTicketNo(Long ticketNo);

    Page<TicketsType> findByCompanyNameContainingIgnoreCaseOrPhoneContainingIgnoreCaseOrEmailContainingIgnoreCase
            (String q1, String q2, String q3, Pageable pageable);
}
