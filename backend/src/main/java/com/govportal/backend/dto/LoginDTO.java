package com.govportal.backend.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class LoginDTO {
    @NotEmpty(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    @NotEmpty(message = "Password is required")
    private String password;
}

