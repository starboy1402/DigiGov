package com.govportal.backend.controller;

import com.govportal.backend.dto.ApplicationDTO;
import com.govportal.backend.dto.ApplicationListItemDTO;
import com.govportal.backend.entity.Application;
import com.govportal.backend.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping
    public ResponseEntity<Application> createApplication(@Valid @RequestBody ApplicationDTO applicationDTO, Authentication principal) {
        String userEmail = principal.getName();
        Application newApplication = applicationService.createApplication(applicationDTO, userEmail);
        return ResponseEntity.ok(newApplication);
    }

    @GetMapping("/my-applications")
    public ResponseEntity<List<ApplicationListItemDTO>> getMyApplications(Authentication principal) {
        String userEmail = principal.getName();
        List<ApplicationListItemDTO> applications = applicationService.getApplicationsByUserEmail(userEmail);
        return ResponseEntity.ok(applications);
    }

    // --- NEW ENDPOINT ---
    @GetMapping("/{id}")
    public ResponseEntity<Application> getApplicationDetails(@PathVariable Long id, Authentication principal) {
        String userEmail = principal.getName();
        Application application = applicationService.getApplicationByIdForUser(id, userEmail);
        return ResponseEntity.ok(application);
    }
}

