package com.example.crmproject.Notes;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface NotesRepository extends JpaRepository<Notes, Long> {

    List<Notes> findAllByTicketId(long id);
}
