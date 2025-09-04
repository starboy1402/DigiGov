package com.govportal.backend.dto;

import com.govportal.backend.entity.Application;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ApplicationListItemDTO {
    private Long applicationId;
    private String serviceName;
    private LocalDate submissionDate;
    private Application.ApplicationStatus status;
    // We will add payment status here later when we build the payment feature
}
