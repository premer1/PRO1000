package com.example.crmproject.Customer;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CustomerRequest(
        @NotBlank @Size(max = 20) String customerNo,
        @NotBlank @Size(max = 120) String companyName,
        @NotBlank @Size(max = 80) String firstName,
        @NotBlank @Size(max = 80) String lastName,
        @NotBlank @Email @Size(max = 120) String email,
        @NotBlank @Size(max = 30) String phone
) {
}
