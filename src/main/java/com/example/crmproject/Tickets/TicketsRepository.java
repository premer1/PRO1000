package com.example.crmproject.Tickets;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TicketsRepository extends JpaRepository<Tickets, String> {
    Optional<Tickets> findById(Long id);
    Optional<Tickets> findByTicketNo(Long ticketNo);

    Page<Tickets> findByCompanyNameContainingIgnoreCaseOrPhoneContainingIgnoreCaseOrEmailContainingIgnoreCase
            (String q1, String q2, String q3, Pageable pageable);
}
