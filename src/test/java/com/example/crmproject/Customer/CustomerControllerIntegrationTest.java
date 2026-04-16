package com.example.crmproject.Customer;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@Transactional
class CustomerControllerIntegrationTest {

    @Autowired
    private CustomerService customerService;

    @Autowired
    private CustomerRepository customerRepository;

    @BeforeEach
    void setUp() {
        customerRepository.deleteAll();
        customerRepository.save(new Customer(
                "10001",
                "Nordic Tools",
                "Nora",
                "Hansen",
                "nora@nordictools.no",
                "90000001"
        ));
        customerRepository.save(new Customer(
                "10002",
                "Bergen Logistics",
                "Per",
                "Olsen",
                "per@bergenlogistics.no",
                "90000002"
        ));
    }

    @Test
    void getCustomersReturnsPagedCustomersWhenQueryIsMissing() throws Exception {
        Page<CustomerResponse> page = customerService.getCustomers(
                null,
                PageRequest.of(0, 8, Sort.by(Sort.Direction.ASC, "companyName"))
        );

        assertEquals(2, page.getTotalElements());
        assertEquals("Bergen Logistics", page.getContent().getFirst().companyName());
        assertEquals("Nordic Tools", page.getContent().get(1).companyName());
    }

    @Test
    void getCustomersFiltersAcrossCustomerFields() throws Exception {
        Page<CustomerResponse> page = customerService.getCustomers(
                "nora",
                PageRequest.of(0, 8, Sort.by(Sort.Direction.ASC, "companyName"))
        );

        assertEquals(1, page.getTotalElements());
        assertEquals("Nordic Tools", page.getContent().getFirst().companyName());
        assertEquals("Nora", page.getContent().getFirst().firstName());
    }
}
