package com.govportal.backend.dto;

import com.govportal.backend.entity.Feedback;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class FeedbackDTO {

    @NotNull(message = "Feedback type is required")
    private Feedback.FeedbackType feedbackType;

    @NotEmpty(message = "Subject is required")
    @Size(max = 255, message = "Subject cannot be longer than 255 characters")
    private String subject;

    @NotEmpty(message = "Message is required")
    private String message;
}
