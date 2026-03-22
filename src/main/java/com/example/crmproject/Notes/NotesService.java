package com.example.crmproject.Notes;

import com.example.crmproject.Tickets.Tickets;
import com.example.crmproject.Tickets.TicketsRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class NotesService {
    private final TicketsRepository ticketsRepository;
    private NotesRepository repo;

    public NotesService(NotesRepository repo, TicketsRepository ticketsRepository) {
        this.repo = repo;
        this.ticketsRepository = ticketsRepository;
    }

    public Notes create(Long id, Notes.CreateNotesRequest req) {
        Tickets ticket = ticketsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        Notes notes = new Notes();
        notes.setCreatedAt(Instant.now());
        notes.setText(req.text());
        notes.setCreatedBy(req.createdBy());
        notes.setTicket(ticket);

        return repo.save(notes);
    }
    public List<Notes> getNotesByTicketId(long id) {
        return repo.findAllByTicketId(id);
    };
}
