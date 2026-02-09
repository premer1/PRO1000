package com.example.crmproject.Tickets;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface TicketsRepository extends JpaRepository<Tickets, String> {
    Optional<Tickets> findById(Long id);
    Optional<Tickets> findByTicketNo(Long ticketNo);
    @Query("select coalesce(max(t.ticketNo), 100000L) from Tickets t")
    Long findMaxTicketNo();

    Page<Tickets> findByCompanyNameContainingIgnoreCaseOrPhoneContainingIgnoreCaseOrEmailContainingIgnoreCase
            (String q1, String q2, String q3, Pageable pageable);
}
