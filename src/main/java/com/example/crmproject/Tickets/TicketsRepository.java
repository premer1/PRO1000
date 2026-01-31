package com.example.crmproject.Tickets;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TicketsRepository extends JpaRepository<Tickets, Long> {
    Optional<Tickets> findByTicketNo(Long ticketNo);
}
