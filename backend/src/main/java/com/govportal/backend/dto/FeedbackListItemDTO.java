package com.govportal.backend.dto;

import com.govportal.backend.entity.Feedback;
import lombok.Data;
import java.sql.Timestamp;

@Data
public class FeedbackListItemDTO {
    private Long id;
    private String userEmail;
    private Feedback.FeedbackType feedbackType;
    private String subject;
    private String message;
    private Feedback.FeedbackStatus status;
    private Timestamp submissionDate;
    private Timestamp updatedAt;
}