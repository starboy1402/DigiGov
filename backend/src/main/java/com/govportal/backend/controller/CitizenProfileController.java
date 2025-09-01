package com.govportal.backend.controller;

import com.govportal.backend.dto.CitizenProfileDTO;
import com.govportal.backend.service.CitizenProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/citizen-profiles")
@CrossOrigin(origins = "*")
public class CitizenProfileController {

    private final CitizenProfileService profileService;

    public CitizenProfileController(CitizenProfileService profileService) {
        this.profileService = profileService;
    }

    @PostMapping
    public ResponseEntity<CitizenProfileDTO> createProfile(@Valid @RequestBody CitizenProfileDTO profileDTO, Authentication principal) {
        String userEmail = principal.getName();
        CitizenProfileDTO createdProfile = profileService.createProfile(profileDTO, userEmail);
        return ResponseEntity.ok(createdProfile);
    }
    
    // --- NEW METHOD ---
    @PutMapping
    public ResponseEntity<CitizenProfileDTO> updateProfile(@Valid @RequestBody CitizenProfileDTO profileDTO, Authentication principal) {
        String userEmail = principal.getName();
        CitizenProfileDTO updatedProfile = profileService.updateProfile(profileDTO, userEmail);
        return ResponseEntity.ok(updatedProfile);
    }

    @GetMapping("/me")
    public ResponseEntity<CitizenProfileDTO> getMyProfile(Authentication principal) {
        String userEmail = principal.getName();
        CitizenProfileDTO profileDTO = profileService.getProfileByUserEmail(userEmail);
        if (profileDTO != null) {
            return ResponseEntity.ok(profileDTO);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}

