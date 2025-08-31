package com.govportal.backend.dto;

import com.govportal.backend.entity.CitizenProfile.Gender;
import com.govportal.backend.entity.CitizenProfile.Religion;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.Date;

@Data
public class CitizenProfileDTO {
    @NotEmpty
    private String name;
    @NotEmpty
    private String fathersName;
    @NotEmpty
    private String mothersName;
    @NotNull
    private Date dateOfBirth;
    @NotEmpty
    private String nidNumber;
    @NotNull
    private Gender gender;
    @NotNull
    private Religion religion;
    @NotEmpty
    private String currentAddress;
    @NotEmpty
    private String permanentAddress;
    @NotEmpty
    private String profession;
}
