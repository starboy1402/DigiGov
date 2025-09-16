package com.govportal.backend.service;

import com.govportal.backend.dto.FeedbackDTO;
import com.govportal.backend.entity.Feedback;
import com.govportal.backend.entity.User;
import com.govportal.backend.repository.FeedbackRepository;
import com.govportal.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;

    public FeedbackService(FeedbackRepository feedbackRepository, UserRepository userRepository) {
        this.feedbackRepository = feedbackRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Feedback saveFeedback(FeedbackDTO feedbackDTO, String userEmail) {
        Feedback feedback = new Feedback();
        feedback.setFeedbackType(feedbackDTO.getFeedbackType());
        feedback.setSubject(feedbackDTO.getSubject());
        feedback.setMessage(feedbackDTO.getMessage());
        feedback.setStatus(Feedback.FeedbackStatus.New);

        if (userEmail != null) {
            Optional<User> userOptional = userRepository.findByEmail(userEmail);
            userOptional.ifPresent(feedback::setUser);
        }

        return feedbackRepository.save(feedback);
    }

    // --- NEW METHOD FOR ADMIN ---
    @Transactional(readOnly = true)
    public List<Feedback> getAllFeedback() {
        return feedbackRepository.findAll();
    }

    // --- NEW METHOD FOR ADMIN ---
    @Transactional
    public Feedback updateFeedbackStatus(Long feedbackId, Feedback.FeedbackStatus newStatus) {
        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new RuntimeException("Feedback not found with ID: " + feedbackId));
        
        feedback.setStatus(newStatus);
        return feedbackRepository.save(feedback);
    }
}

