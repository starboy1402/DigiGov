package com.govportal.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponseDTO {
    private String token;
    private Long userId;
    private String email;
    private Long adminId;
    private String username;
}

