package com.govportal.backend.controller;

import com.govportal.backend.dto.FeedbackDTO;
import com.govportal.backend.dto.FeedbackListItemDTO; // Import the new DTO
import com.govportal.backend.entity.Feedback;
import com.govportal.backend.service.FeedbackService;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List; // Import List
import java.util.Map; // Import Map

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "*")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @PostMapping
    public ResponseEntity<Feedback> submitFeedback(@Valid @RequestBody FeedbackDTO feedbackDTO, Authentication principal) {
        String userEmail = (principal != null) ? principal.getName() : null;
        Feedback savedFeedback = feedbackService.saveFeedback(feedbackDTO, userEmail);
        return new ResponseEntity<>(savedFeedback, HttpStatus.CREATED);
    }

    // Add the following methods
    @GetMapping
    public ResponseEntity<List<FeedbackListItemDTO>> getAllFeedback() {
        return ResponseEntity.ok(feedbackService.getAllFeedback());
    }

   @PutMapping("/{id}/status")
    public ResponseEntity<FeedbackListItemDTO> updateFeedbackStatus(@PathVariable Long id, @RequestBody Map<String, String> body) { // Change return type here
        Feedback.FeedbackStatus newStatus = Feedback.FeedbackStatus.valueOf(body.get("status"));
        FeedbackListItemDTO updatedFeedbackDTO = feedbackService.updateFeedbackStatus(id, newStatus); // Get the DTO from the service
        return ResponseEntity.ok(updatedFeedbackDTO); // Return the DTO
    }
}