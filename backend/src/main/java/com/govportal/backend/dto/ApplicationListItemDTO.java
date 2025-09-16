package com.govportal.backend.dto;

import com.govportal.backend.entity.Application;
import lombok.Data;

import java.time.LocalDate;
import java.util.Map; // Import Map

@Data
public class ApplicationListItemDTO {
    private Long applicationId;
    private String serviceName;
    private LocalDate submissionDate;
    private Application.ApplicationStatus status;
    private Application.PaymentStatus paymentStatus;
    private Map<String, Object> serviceSpecificData; // Add this line
}