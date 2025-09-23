package com.govportal.backend.repository;

import com.govportal.backend.entity.Application;
import com.govportal.backend.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    // SQL: SELECT * FROM documents WHERE application_id = ?;
    List<Document> findByApplication(Application application);
}
