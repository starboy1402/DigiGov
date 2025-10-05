package com.govportal.backend.service;

import com.govportal.backend.dto.FeedbackDTO;
import com.govportal.backend.dto.FeedbackListItemDTO; // Import the new DTO
import com.govportal.backend.entity.Admin;
import com.govportal.backend.entity.Feedback;
import com.govportal.backend.entity.User;
import com.govportal.backend.repository.AdminRepository;
import com.govportal.backend.repository.FeedbackRepository;
import com.govportal.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List; // Import List
import java.util.Optional;
import java.util.stream.Collectors; // Import Collectors

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;
    private final AdminRepository adminRepository;

    public FeedbackService(FeedbackRepository feedbackRepository, UserRepository userRepository,
            AdminRepository adminRepository) {
        this.feedbackRepository = feedbackRepository;
        this.userRepository = userRepository;
        this.adminRepository = adminRepository;
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

    // Add the following methods
    @Transactional(readOnly = true)
    public List<FeedbackListItemDTO> getAllFeedback() {
        return feedbackRepository.findAll().stream()
                .map(this::mapEntityToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public FeedbackListItemDTO updateFeedbackStatus(Long feedbackId, Feedback.FeedbackStatus newStatus,
            String adminUsername) { // Change return type here
        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new RuntimeException("Feedback not found with ID: " + feedbackId));

        // Set the admin who updated the status
        if (adminUsername != null) {
            Admin admin = adminRepository.findByUsername(adminUsername)
                    .orElseThrow(() -> new RuntimeException("Admin not found with username: " + adminUsername));
            feedback.setAdmin(admin);
        }

        feedback.setStatus(newStatus);
        Feedback updatedFeedback = feedbackRepository.save(feedback);
        return mapEntityToDto(updatedFeedback); // Return the mapped DTO
    }

    private FeedbackListItemDTO mapEntityToDto(Feedback feedback) {
        FeedbackListItemDTO dto = new FeedbackListItemDTO();
        dto.setId(feedback.getId());
        if (feedback.getUser() != null) {
            dto.setUserEmail(feedback.getUser().getEmail());
        }
        dto.setFeedbackType(feedback.getFeedbackType());
        dto.setSubject(feedback.getSubject());
        dto.setMessage(feedback.getMessage());
        dto.setStatus(feedback.getStatus());
        dto.setSubmissionDate(feedback.getSubmissionDate());
        dto.setUpdatedAt(feedback.getUpdatedAt());
        return dto;
    }
}