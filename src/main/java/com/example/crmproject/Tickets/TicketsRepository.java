package com.example.crmproject.Tickets;

import com.example.crmproject.Customer.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TicketsRepository extends JpaRepository<Tickets, Long> {

    Optional<Tickets> findById(Long id);

    @Query("select coalesce(max(t.ticketNo), 0) from Tickets t")
    long findMaxTicketNo();
}
