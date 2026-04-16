package com.example.crmproject.Tickets;

import com.example.crmproject.Common.ApiException;
import com.example.crmproject.Customer.Customer;
import com.example.crmproject.Customer.CustomerRepository;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.util.List;

@Service
public class TicketsService {
    private final TicketsRepository repo;
    private final CustomerRepository customerRepo;

    public TicketsService(TicketsRepository repo, CustomerRepository customerRepo) {
        this.repo = repo;
        this.customerRepo = customerRepo;
    }

    @Transactional
    public TicketResponse create(TicketRequest req) {
        Tickets ticket = new Tickets();
        ticket.setTicketNo(nextTicketNumber());
        ticket.setCreated(Instant.now());
        applyRequest(ticket, req);
        return toResponse(repo.save(ticket));
    }

    @Transactional(readOnly = true)
    public List<TicketResponse> findAll(String query,
                                        Tickets.TicketStatus status,
                                        Tickets.TicketPriority priority,
                                        Long customerId) {
        Sort sort = Sort.by(Sort.Order.desc("updatedLast"), Sort.Order.desc("created"));
        return repo.findAll(buildSpecification(query, status, priority, customerId), sort)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public TicketResponse getById(Long id) {
        return toResponse(getEntity(id));
    }

    @Transactional(readOnly = true)
    public Tickets getEntity(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Fant ikke ticket med id " + id));
    }

    @Transactional
    public TicketResponse update(Long id, TicketRequest request) {
        Tickets ticket = getEntity(id);
        applyRequest(ticket, request);
        return toResponse(repo.save(ticket));
    }

    @Transactional
    public TicketResponse updateStatus(Long id, Tickets.TicketStatus status) {
        Tickets ticket = getEntity(id);
        ticket.setStatus(status);
        if (status == Tickets.TicketStatus.CLOSED) {
            ticket.setClosedAt(Instant.now());
        } else {
            ticket.setClosedAt(null);
        }
        ticket.setUpdatedLast(Instant.now());
        return toResponse(repo.save(ticket));
    }

    public long countTicketsByStatus(Tickets.TicketStatus status) {
        return repo.countByStatus(status);
    }

    public long countNotClosedTickets() {
        return repo.countByStatusNot(Tickets.TicketStatus.CLOSED);
    }

    private void applyRequest(Tickets ticket, TicketRequest req) {
        Customer customer = null;
        if (req.customerId() != null) {
            customer = customerRepo.findById(req.customerId())
                    .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "Valgt kunde finnes ikke"));
        }

        if (!StringUtils.hasText(req.companyName()) && customer == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Firmanavn må fylles ut");
        }

        ticket.setCustomer(customer);
        ticket.setSubject(trim(req.subject()));
        ticket.setDescription(trim(req.description()));
        ticket.setContactName(trim(req.contactName()));
        ticket.setCompanyName(StringUtils.hasText(req.companyName()) ? trim(req.companyName()) : customer.getCompanyName());
        ticket.setEmail(trim(req.email()).toLowerCase());
        ticket.setPhone(trim(req.phone()));
        ticket.setCategory(req.category());
        ticket.setPriority(req.priority());
        ticket.setStatus(req.status());
        if (ticket.getStatus() == Tickets.TicketStatus.CLOSED) {
            ticket.setClosedAt(Instant.now());
        } else {
            ticket.setClosedAt(null);
        }
        ticket.setUpdatedLast(Instant.now());
    }

    private Specification<Tickets> buildSpecification(String query,
                                                      Tickets.TicketStatus status,
                                                      Tickets.TicketPriority priority,
                                                      Long customerId) {
        return (root, queryDef, criteriaBuilder) -> {
            var predicate = criteriaBuilder.conjunction();

            if (StringUtils.hasText(query)) {
                String likePattern = "%" + query.trim().toLowerCase() + "%";
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.or(
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("subject")), likePattern),
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), likePattern),
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("companyName")), likePattern),
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("contactName")), likePattern),
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("category")), likePattern),
                                criteriaBuilder.like(root.get("ticketNo").as(String.class), likePattern)
                        )
                );
            }

            if (status != null) {
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.equal(root.get("status"), status));
            }

            if (priority != null) {
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.equal(root.get("priority"), priority));
            }

            if (customerId != null) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.equal(root.get("customer").get("id"), customerId)
                );
            }

            return predicate;
        };
    }

    private long nextTicketNumber() {
        long current = repo.findMaxTicketNo();
        return current < 10000 ? 10000 : current + 1;
    }

    private String trim(String value) {
        return value == null ? "" : value.trim();
    }

    public TicketResponse toResponse(Tickets ticket) {
        Long customerId = ticket.getCustomer() != null ? ticket.getCustomer().getId() : null;
        String customerName = ticket.getCustomer() != null ? ticket.getCustomer().getCompanyName() : null;

        return new TicketResponse(
                ticket.getId(),
                ticket.getTicketNo(),
                ticket.getSubject(),
                ticket.getDescription(),
                ticket.getContactName(),
                ticket.getCompanyName(),
                ticket.getEmail(),
                ticket.getPhone(),
                ticket.getStatus(),
                ticket.getPriority(),
                ticket.getCategory(),
                customerId,
                customerName,
                ticket.getCreated(),
                ticket.getUpdatedLast(),
                ticket.getClosedAt()
        );
    }
}
