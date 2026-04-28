package com.example.crmproject.Notes;

import java.time.Instant;

public record NoteResponse(
        Long id,
        String text,
        Instant createdAt,
        String createdBy
) {
}
