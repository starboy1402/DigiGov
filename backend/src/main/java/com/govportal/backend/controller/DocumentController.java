package com.govportal.backend.controller;

import com.govportal.backend.entity.Application;
import com.govportal.backend.entity.Document;
import com.govportal.backend.repository.ApplicationRepository;
import com.govportal.backend.repository.DocumentRepository;
import com.govportal.backend.service.FileStorageService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "*")
public class DocumentController {

    private final FileStorageService fileStorageService;
    private final DocumentRepository documentRepository;
    private final ApplicationRepository applicationRepository;

    public DocumentController(FileStorageService fileStorageService, DocumentRepository documentRepository, ApplicationRepository applicationRepository) {
        this.fileStorageService = fileStorageService;
        this.documentRepository = documentRepository;
        this.applicationRepository = applicationRepository;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file,
                                        @RequestParam("applicationId") Long applicationId,
                                        @RequestParam("documentType") String documentType) {

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found with ID: " + applicationId));

        String fileName = fileStorageService.storeFile(file);

        Document doc = new Document();
        doc.setApplication(application);
        doc.setDocumentType(documentType);
        doc.setFileName(file.getOriginalFilename());
        doc.setFilePath(fileName); // Store the unique name

        documentRepository.save(doc);

        return ResponseEntity.ok().body("File uploaded successfully: " + fileName);
    }
}
