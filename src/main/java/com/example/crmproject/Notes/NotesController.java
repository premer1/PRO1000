package com.example.crmproject.Notes;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("http://localhost:5173")
@RequestMapping("/api/v1/tickets")
@RestController
public class NotesController {

    private final NotesService service;

    public NotesController(NotesService service) {
        this.service = service;}

    @GetMapping("/{id}/notes")
    public List<Notes> getNotesByTicketTicketId(@PathVariable long id) {
        return service.getNotesByTicketId(id);
    }

    @PostMapping("/{id}/notes")
    public Notes create(
            @PathVariable long id,
            @Valid @RequestBody Notes.CreateNotesRequest req) {
        return service.create(id, req);
    }
}
