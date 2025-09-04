package com.govportal.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.Map;

@Data
public class ApplicationDTO {

    @NotNull(message = "Service ID is required")
    private Long serviceId;

    private Map<String, Object> serviceSpecificData;
}
