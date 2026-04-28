package com.example.crmproject.Customer;

import java.time.Instant;

public record CustomerResponse(
        Long id,
        String customerNo,
        String companyName,
        String firstName,
        String lastName,
        String email,
        String phone,
        Instant createdAt,
        Instant updatedAt
) {
}
