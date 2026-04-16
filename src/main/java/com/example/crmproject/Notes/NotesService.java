package com.example.crmproject.Notes;

import com.example.crmproject.Common.ApiException;
import com.example.crmproject.Tickets.Tickets;
import com.example.crmproject.Tickets.TicketsRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.util.List;

@Service
public class NotesService {
    private final TicketsRepository ticketsRepository;
    private final NotesRepository repo;

    public NotesService(NotesRepository repo, TicketsRepository ticketsRepository) {
        this.repo = repo;
        this.ticketsRepository = ticketsRepository;
    }

    @Transactional
    public NoteResponse create(Long id, Notes.CreateNotesRequest req) {
        Tickets ticket = ticketsRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Fant ikke ticket med id " + id));

        Notes notes = new Notes();
        notes.setCreatedAt(Instant.now());
        notes.setText(req.text());
        notes.setCreatedBy(StringUtils.hasText(req.createdBy()) ? req.createdBy().trim() : "CRM team");
        notes.setTicket(ticket);

        return toResponse(repo.save(notes));
    }

    @Transactional(readOnly = true)
    public List<NoteResponse> getNotesByTicketId(long id) {
        return repo.findAllByTicketIdOrderByCreatedAtDesc(id)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private NoteResponse toResponse(Notes note) {
        return new NoteResponse(note.getId(), note.getText(), note.getCreatedAt(), note.getCreatedBy());
    }
}
