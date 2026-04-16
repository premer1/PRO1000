package com.example.crmproject.Tickets;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TicketsRepository extends JpaRepository<Tickets, Long>, JpaSpecificationExecutor<Tickets> {
    Optional<Tickets> findById(Long id);
    Optional<Tickets> findByTicketNo(Long ticketNo);
    List<Tickets> findTop5ByOrderByUpdatedLastDesc();
    List<Tickets> findAllByCustomerId(Long customerId);

    long countByStatus(Tickets.TicketStatus status);
    long countByStatusNot(Tickets.TicketStatus status);

    @Query("select coalesce(max(t.ticketNo), 0) from Tickets t")
    long findMaxTicketNo();

    @Query("""
            select count(distinct t.customer.id)
            from Tickets t
            where t.customer is not null
              and t.status <> :status
            """)
    long countDistinctCustomersByStatusNot(@Param("status") Tickets.TicketStatus status);
}
