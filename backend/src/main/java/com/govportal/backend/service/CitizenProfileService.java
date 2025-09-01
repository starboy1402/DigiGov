package com.govportal.backend.service;

import com.govportal.backend.dto.CitizenProfileDTO;
import com.govportal.backend.entity.CitizenProfile;
import com.govportal.backend.entity.User;
import com.govportal.backend.repository.CitizenProfileRepository;
import com.govportal.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CitizenProfileService {

    private final CitizenProfileRepository citizenProfileRepository;
    private final UserRepository userRepository;

    public CitizenProfileService(CitizenProfileRepository citizenProfileRepository, UserRepository userRepository) {
        this.citizenProfileRepository = citizenProfileRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public CitizenProfileDTO createProfile(CitizenProfileDTO profileDTO, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (citizenProfileRepository.findByUser(user).isPresent()) {
            throw new RuntimeException("Profile already exists for this user.");
        }

        CitizenProfile profile = new CitizenProfile();
        profile.setUser(user);
        // ... map all other fields from DTO to entity ...
        mapDtoToEntity(profileDTO, profile);

        CitizenProfile savedProfile = citizenProfileRepository.save(profile);
        return mapEntityToDto(savedProfile);
    }
    
    // --- NEW METHOD ---
    @Transactional
    public CitizenProfileDTO updateProfile(CitizenProfileDTO profileDTO, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        CitizenProfile profile = citizenProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not found for this user."));

        // Update existing profile with new data from DTO
        mapDtoToEntity(profileDTO, profile);
        
        CitizenProfile updatedProfile = citizenProfileRepository.save(profile);
        return mapEntityToDto(updatedProfile);
    }

    @Transactional(readOnly = true)
    public CitizenProfileDTO getProfileByUserEmail(String email) {
        return citizenProfileRepository.findByUserEmail(email)
                .map(this::mapEntityToDto)
                .orElse(null);
    }

    private void mapDtoToEntity(CitizenProfileDTO dto, CitizenProfile entity) {
        entity.setName(dto.getName());
        entity.setFathersName(dto.getFathersName());
        entity.setMothersName(dto.getMothersName());
        entity.setDateOfBirth(dto.getDateOfBirth());
        entity.setNidNumber(dto.getNidNumber());
        entity.setGender(dto.getGender());
        entity.setReligion(dto.getReligion());
        entity.setCurrentAddress(dto.getCurrentAddress());
        entity.setPermanentAddress(dto.getPermanentAddress());
        entity.setProfession(dto.getProfession());
    }

    private CitizenProfileDTO mapEntityToDto(CitizenProfile entity) {
        CitizenProfileDTO dto = new CitizenProfileDTO();
        dto.setCitizenProfileId(entity.getId());
        dto.setName(entity.getName());
        dto.setFathersName(entity.getFathersName());
        dto.setMothersName(entity.getMothersName());
        dto.setDateOfBirth(entity.getDateOfBirth());
        dto.setNidNumber(entity.getNidNumber());
        dto.setGender(entity.getGender());
        dto.setReligion(entity.getReligion());
        dto.setCurrentAddress(entity.getCurrentAddress());
        dto.setPermanentAddress(entity.getPermanentAddress());
        dto.setProfession(entity.getProfession());
        return dto;
    }
}

