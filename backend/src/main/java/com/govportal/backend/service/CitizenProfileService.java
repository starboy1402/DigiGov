package com.govportal.backend.service;

import com.govportal.backend.dto.CitizenProfileDTO;
import com.govportal.backend.entity.CitizenProfile;
import com.govportal.backend.entity.User;
import com.govportal.backend.repository.CitizenProfileRepository;
import com.govportal.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class CitizenProfileService {

    private final CitizenProfileRepository profileRepository;
    private final UserRepository userRepository;

    public CitizenProfileService(CitizenProfileRepository profileRepository, UserRepository userRepository) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
    }

    public CitizenProfile createProfile(CitizenProfileDTO profileDTO, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found in database."));

        CitizenProfile profile = new CitizenProfile();
        profile.setUser(user);
        profile.setName(profileDTO.getName());
        profile.setFathersName(profileDTO.getFathersName());
        profile.setMothersName(profileDTO.getMothersName());
        profile.setDateOfBirth(profileDTO.getDateOfBirth());
        profile.setNidNumber(profileDTO.getNidNumber());
        profile.setGender(profileDTO.getGender());
        profile.setReligion(profileDTO.getReligion());
        profile.setCurrentAddress(profileDTO.getCurrentAddress());
        profile.setPermanentAddress(profileDTO.getPermanentAddress());
        profile.setProfession(profileDTO.getProfession());

        return profileRepository.save(profile);
    }
        public CitizenProfileDTO getProfileByUserEmail(String email) {
        // 1. Ask the "Repository" to find the profile in the database.
        return profileRepository.findByUserEmail(email)
                // 2. If a profile is found...
                .map(profile -> {
                    // ...convert it to a DTO (a safe data format for the API).
                    CitizenProfileDTO dto = new CitizenProfileDTO();
                    // ... map all the fields ...
                    return dto;
                })
                // 3. If no profile is found, return null.
                .orElse(null);
    }
}

