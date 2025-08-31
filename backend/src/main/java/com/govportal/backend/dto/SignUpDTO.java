package com.govportal.backend.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class SignUpDTO {
    @NotEmpty(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    @NotEmpty(message = "Phone number is required")
    private String phone;

    @NotEmpty(message = "Password is required")
    @Size(min = 6, message = "Password should have at least 6 characters")
    private String password;
}

