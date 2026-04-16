package com.example.crmproject.Notes;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/v1/tickets")
@RestController
public class NotesController {

    private final NotesService service;

    public NotesController(NotesService service) {
        this.service = service;
    }

    @GetMapping("/{id}/notes")
    public List<NoteResponse> getNotesByTicketTicketId(@PathVariable long id) {
        return service.getNotesByTicketId(id);
    }

    @PostMapping("/{id}/notes")
    @ResponseStatus(HttpStatus.CREATED)
    public NoteResponse create(
            @PathVariable long id,
            @Valid @RequestBody Notes.CreateNotesRequest req) {
        return service.create(id, req);
    }
}
