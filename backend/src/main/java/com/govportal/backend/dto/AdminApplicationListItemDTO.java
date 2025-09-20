package com.govportal.backend.dto;

import com.govportal.backend.entity.Application;
import lombok.Data;

import java.time.LocalDate;
import java.util.Map;

@Data
public class AdminApplicationListItemDTO {
    private Long applicationId;
    private Long userId;
    private String serviceName;
    private LocalDate submissionDate;
    private Application.ApplicationStatus status;
    private Application.PaymentStatus paymentStatus;
    private Map<String, Object> serviceSpecificData;
    private String applicantName;
    private String fathersName;
    private String mothersName;
    private LocalDate dateOfBirth;
    private String nidNumber;
    private String profession;
}
