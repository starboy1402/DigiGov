package com.govportal.backend.controller;

import com.govportal.backend.dto.FeedbackDTO;
import com.govportal.backend.entity.Feedback;
import com.govportal.backend.service.FeedbackService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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
        // The 'principal' will be null if the user is not logged in, which is okay.
        String userEmail = (principal != null) ? principal.getName() : null;
        Feedback savedFeedback = feedbackService.saveFeedback(feedbackDTO, userEmail);
        return new ResponseEntity<>(savedFeedback, HttpStatus.CREATED);
    }
}
