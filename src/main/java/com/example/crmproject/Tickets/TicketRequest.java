package com.example.crmproject.Tickets;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TicketRequest(
        Long customerId,
        @NotBlank @Size(max = 150) String subject,
        @NotBlank @Size(max = 4000) String description,
        @NotBlank @Size(max = 120) String contactName,
        @Size(max = 150) String companyName,
        @NotBlank @Email @Size(max = 120) String email,
        @NotBlank @Size(max = 30) String phone,
        Tickets.TicketStatus status,
        Tickets.TicketPriority priority,
        @Size(max = 80) String category
) {
}
