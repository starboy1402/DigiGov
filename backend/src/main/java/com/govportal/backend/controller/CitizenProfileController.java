package com.govportal.backend.controller;

import com.govportal.backend.dto.CitizenProfileDTO;
import com.govportal.backend.entity.CitizenProfile;
import com.govportal.backend.service.CitizenProfileService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/citizen-profiles")
public class CitizenProfileController {

    private final CitizenProfileService profileService;

    public CitizenProfileController(CitizenProfileService profileService) {
        this.profileService = profileService;
    }

    @PostMapping
    public ResponseEntity<?> createProfile(@Valid @RequestBody CitizenProfileDTO profileDTO, @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return new ResponseEntity<>("User not authenticated", HttpStatus.UNAUTHORIZED);
        }
        
        try {
            String userEmail = userDetails.getUsername(); // Get email from the authenticated user (JWT token)
            CitizenProfile createdProfile = profileService.createProfile(profileDTO, userEmail);
            return new ResponseEntity<>(createdProfile, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
        @GetMapping("/me")
    public ResponseEntity<CitizenProfileDTO> getMyProfile(Authentication principal) {
        // 1. Get the logged-in user's email securely from the token.
        String userEmail = principal.getName();
        
        // 2. Ask the "Service" layer to find the profile for this user.
        CitizenProfileDTO profileDTO = profileService.getProfileByUserEmail(userEmail);
        
        // 3. If a profile is found, send it back. If not, send a 404 Not Found.
        if (profileDTO != null) {
            return ResponseEntity.ok(profileDTO);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}

