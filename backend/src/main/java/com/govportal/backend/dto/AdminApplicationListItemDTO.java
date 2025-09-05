package com.govportal.backend.dto;

import com.govportal.backend.entity.Application;
import lombok.Data;

import java.time.LocalDate;

@Data
public class AdminApplicationListItemDTO {
    private Long applicationId;
    private Long userId;
    private String serviceName;
    private LocalDate submissionDate;
    private Application.ApplicationStatus status;
    private Application.PaymentStatus paymentStatus;
}

