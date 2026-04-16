package com.example.crmproject;

import com.example.crmproject.Customer.Customer;
import com.example.crmproject.Customer.CustomerRepository;
import com.example.crmproject.Notes.Notes;
import com.example.crmproject.Notes.NotesRepository;
import com.example.crmproject.Tickets.Tickets;
import com.example.crmproject.Tickets.TicketsRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;

@Component
public class DemoDataSeeder implements CommandLineRunner {

    private final CustomerRepository customerRepository;
    private final TicketsRepository ticketsRepository;
    private final NotesRepository notesRepository;
    private final boolean seedEnabled;

    public DemoDataSeeder(
            CustomerRepository customerRepository,
            TicketsRepository ticketsRepository,
            NotesRepository notesRepository,
            @Value("${app.seed-demo-data:true}") boolean seedEnabled
    ) {
        this.customerRepository = customerRepository;
        this.ticketsRepository = ticketsRepository;
        this.notesRepository = notesRepository;
        this.seedEnabled = seedEnabled;
    }

    @Override
    public void run(String... args) {
        if (!seedEnabled || customerRepository.count() > 0 || ticketsRepository.count() > 0) {
            return;
        }

        Customer northwind = customerRepository.save(new Customer("10000", "Northwind Logistics", "Sara", "Hansen", "sara@northwind.no", "+47 900 11 111"));
        Customer polar = customerRepository.save(new Customer("10001", "Polar Retail", "Jonas", "Lund", "jonas@polarretail.no", "+47 900 22 222"));
        Customer fjord = customerRepository.save(new Customer("10002", "Fjord Finance", "Mina", "Berg", "mina@fjordfinance.no", "+47 900 33 333"));
        Customer skyline = customerRepository.save(new Customer("10003", "Skyline Tech", "Aksel", "Lie", "aksel@skyline.io", "+47 900 44 444"));
        Customer aurora = customerRepository.save(new Customer("10004", "Aurora Health", "Lea", "Nilsen", "lea@aurorahealth.no", "+47 900 55 555"));

        Tickets accessTicket = createTicket(10000L, northwind, "Brukere får ikke logget inn", "Flere ansatte får feilmelding når de prøver å logge inn i kundeportalen.", "Sara Hansen", "support@northwind.no", "+47 900 11 111", Tickets.TicketStatus.OPEN, Tickets.TicketPriority.CRITICAL, "Access");
        Tickets billingTicket = createTicket(10001L, polar, "Uventet faktura for mars", "Kunden mener de har blitt fakturert dobbelt for mars måned.", "Jonas Lund", "jonas@polarretail.no", "+47 900 22 222", Tickets.TicketStatus.WAITING, Tickets.TicketPriority.MEDIUM, "Billing");
        Tickets apiTicket = createTicket(10002L, fjord, "API-sync stopper ved import", "Integrasjonen mot regnskapssystemet stopper ved import av nye kunder.", "Mina Berg", "mina@fjordfinance.no", "+47 900 33 333", Tickets.TicketStatus.IN_PROGRESS, Tickets.TicketPriority.HIGH, "Integration");
        Tickets bugTicket = createTicket(10003L, skyline, "Rapporter lastes ikke", "Rapportmodulen viser blank side når brukeren åpner salgsrapport.", "Aksel Lie", "aksel@skyline.io", "+47 900 44 444", Tickets.TicketStatus.OPEN, Tickets.TicketPriority.HIGH, "Bug");
        Tickets onboardingTicket = createTicket(10004L, aurora, "Ønsker opplæring i dashboards", "Teamet ønsker et kort onboardingsmøte for å bruke dashboard og ticketoversikt mer effektivt.", "Lea Nilsen", "lea@aurorahealth.no", "+47 900 55 555", Tickets.TicketStatus.CLOSED, Tickets.TicketPriority.LOW, "Customer Success");

        ticketsRepository.saveAll(List.of(accessTicket, billingTicket, apiTicket, bugTicket, onboardingTicket));

        notesRepository.save(createNote(accessTicket, "Feilen er gjenskapt av support og eskalert til utviklingsteamet.", "CRM team"));
        notesRepository.save(createNote(apiTicket, "Kunden har sendt eksempelpayload som brukes i videre feilsøking.", "Aksel"));
        notesRepository.save(createNote(onboardingTicket, "Opplæringsmøte gjennomført og ticket lukket.", "CRM team"));
    }

    private Tickets createTicket(Long ticketNo,
                                 Customer customer,
                                 String subject,
                                 String description,
                                 String contactName,
                                 String email,
                                 String phone,
                                 Tickets.TicketStatus status,
                                 Tickets.TicketPriority priority,
                                 String category) {
        Tickets ticket = new Tickets();
        ticket.setTicketNo(ticketNo);
        ticket.setCustomer(customer);
        ticket.setSubject(subject);
        ticket.setDescription(description);
        ticket.setContactName(contactName);
        ticket.setCompanyName(customer.getCompanyName());
        ticket.setEmail(email);
        ticket.setPhone(phone);
        ticket.setStatus(status);
        ticket.setPriority(priority);
        ticket.setCategory(category);
        ticket.setCreated(Instant.now());
        ticket.setUpdatedLast(Instant.now());
        if (status == Tickets.TicketStatus.CLOSED) {
            ticket.setClosedAt(Instant.now());
        }
        return ticket;
    }

    private Notes createNote(Tickets ticket, String text, String createdBy) {
        Notes note = new Notes();
        note.setTicket(ticket);
        note.setText(text);
        note.setCreatedBy(createdBy);
        note.setCreatedAt(Instant.now());
        return note;
    }
}
