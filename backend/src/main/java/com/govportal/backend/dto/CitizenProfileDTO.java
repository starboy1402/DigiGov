package com.govportal.backend.dto;

import com.govportal.backend.entity.CitizenProfile;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CitizenProfileDTO {

    // --- NEW FIELD ---
    // This will be used when sending data FROM the server back TO the client.
    private Long citizenProfileId;

    @NotEmpty(message = "Name is required")
    private String name;

    @NotEmpty(message = "Father's name is required")
    private String fathersName;

    @NotEmpty(message = "Mother's name is required")
    private String mothersName;

    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    @NotEmpty(message = "NID number is required")
    @Size(min = 10, max = 17, message = "NID number must be between 10 and 17 digits")
    private String nidNumber;

    @NotNull(message = "Gender is required")
    private CitizenProfile.Gender gender;

    @NotNull(message = "Religion is required")
    private CitizenProfile.Religion religion;

    @NotEmpty(message = "Current address is required")
    private String currentAddress;

    @NotEmpty(message = "Permanent address is required")
    private String permanentAddress;

    @NotEmpty(message = "Profession is required")
    private String profession;
}

