package com.example.crmproject.Customer;

import com.example.crmproject.Common.ApiException;
import com.example.crmproject.Tickets.Tickets;
import com.example.crmproject.Tickets.TicketsRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;

@Service
public class CustomerService {

    private final CustomerRepository repo;
    private final TicketsRepository ticketsRepository;

    public CustomerService(CustomerRepository repo, TicketsRepository ticketsRepository) {
        this.repo = repo;
        this.ticketsRepository = ticketsRepository;
    }

    @Transactional(readOnly = true)
    public List<CustomerResponse> getAll() {
        return repo.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public CustomerResponse create(CustomerRequest request) {
        validateUniqueFields(request, null);
        Customer customer = new Customer(
                normalize(request.customerNo()),
                normalize(request.companyName()),
                normalize(request.firstName()),
                normalize(request.lastName()),
                normalize(request.email()).toLowerCase(),
                normalize(request.phone())
        );
        return toResponse(repo.save(customer));
    }

    @Transactional(readOnly = true)
    public CustomerResponse getById(Long id) {
        return toResponse(getEntity(id));
    }

    @Transactional(readOnly = true)
    public Customer getEntity(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Fant ikke kunde med id " + id));
    }

    @Transactional(readOnly = true)
    public Page<CustomerResponse> getCustomers(String query, Pageable pageable) {
        String normalizedQuery = normalizeNullable(query);
        if (normalizedQuery == null) {
            return repo.findAll(pageable).map(this::toResponse);
        }

        return repo.findAll(buildSearchSpecification(normalizedQuery), pageable).map(this::toResponse);
    }

    @Transactional
    public CustomerResponse update(Long id, CustomerRequest request) {
        Customer existing = getEntity(id);
        validateUniqueFields(request, id);

        existing.setCustomerNo(normalize(request.customerNo()));
        existing.setCompanyName(normalize(request.companyName()));
        existing.setFirstName(normalize(request.firstName()));
        existing.setLastName(normalize(request.lastName()));
        existing.setEmail(normalize(request.email()).toLowerCase());
        existing.setPhone(normalize(request.phone()));

        return toResponse(repo.save(existing));
    }

    @Transactional
    public void delete(Long id) {
        Customer customer = getEntity(id);
        List<Tickets> relatedTickets = ticketsRepository.findAllByCustomerId(id);
        for (Tickets ticket : relatedTickets) {
            ticket.setCustomer(null);
        }
        ticketsRepository.saveAll(relatedTickets);
        repo.delete(customer);
    }

    private void validateCustomerNo(String customerNo) {
        try {
            int customerNoAsInt = Integer.parseInt(customerNo);
            if (customerNoAsInt < 10000) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "Kundenummerserien starter på 10000");
            }
        } catch (NumberFormatException ex) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Kundenummer må være et gyldig tall");
        }
    }

    private void validateUniqueFields(CustomerRequest request, Long customerId) {
        String customerNo = normalize(request.customerNo());
        String email = normalize(request.email()).toLowerCase();
        String phone = normalize(request.phone());

        validateCustomerNo(customerNo);

        if (customerId == null) {
            if (repo.existsByCustomerNo(customerNo)) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "Kundenummeret eksisterer allerede");
            }
            if (repo.existsByEmail(email)) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "E-postadressen eksisterer allerede");
            }
            if (repo.existsByPhone(phone)) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "Telefonnummeret eksisterer allerede");
            }
            return;
        }

        if (repo.existsByCustomerNoAndIdNot(customerNo, customerId)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Kundenummeret eksisterer allerede");
        }
        if (repo.existsByEmailAndIdNot(email, customerId)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "E-postadressen eksisterer allerede");
        }
        if (repo.existsByPhoneAndIdNot(phone, customerId)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Telefonnummeret eksisterer allerede");
        }
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim();
    }

    private String normalizeNullable(String value) {
        if (value == null) {
            return null;
        }

        String normalized = value.trim();
        return normalized.isEmpty() ? null : normalized;
    }

    private Specification<Customer> buildSearchSpecification(String query) {
        String likeQuery = "%" + query.toLowerCase(Locale.ROOT) + "%";

        return (root, ignoredQuery, criteriaBuilder) -> criteriaBuilder.or(
                criteriaBuilder.like(criteriaBuilder.lower(root.get("customerNo")), likeQuery),
                criteriaBuilder.like(criteriaBuilder.lower(root.get("companyName")), likeQuery),
                criteriaBuilder.like(criteriaBuilder.lower(root.get("firstName")), likeQuery),
                criteriaBuilder.like(criteriaBuilder.lower(root.get("lastName")), likeQuery),
                criteriaBuilder.like(criteriaBuilder.lower(root.get("email")), likeQuery),
                criteriaBuilder.like(criteriaBuilder.lower(root.get("phone")), likeQuery)
        );
    }

    private CustomerResponse toResponse(Customer customer) {
        return new CustomerResponse(
                customer.getId(),
                customer.getCustomerNo(),
                customer.getCompanyName(),
                customer.getFirstName(),
                customer.getLastName(),
                customer.getEmail(),
                customer.getPhone(),
                customer.getCreatedAt(),
                customer.getUpdatedAt()
        );
    }
}
