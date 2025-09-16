package com.govportal.backend.service;

import com.govportal.backend.dto.ApplicationDTO;
import com.govportal.backend.dto.ApplicationListItemDTO;
import com.govportal.backend.entity.Application;
import com.govportal.backend.entity.CitizenProfile;
import com.govportal.backend.entity.Service;
import com.govportal.backend.entity.User;
import com.govportal.backend.repository.ApplicationRepository;
import com.govportal.backend.repository.CitizenProfileRepository;
import com.govportal.backend.repository.ServiceRepository;
import com.govportal.backend.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final CitizenProfileRepository citizenProfileRepository;
    private final ServiceRepository serviceRepository;

    public ApplicationService(ApplicationRepository applicationRepository, UserRepository userRepository, CitizenProfileRepository citizenProfileRepository, ServiceRepository serviceRepository) {
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.citizenProfileRepository = citizenProfileRepository;
        this.serviceRepository = serviceRepository;
    }

    @Transactional
    public Application createApplication(ApplicationDTO applicationDTO, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        CitizenProfile profile = citizenProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Citizen profile not found. Please create a profile first."));

        Service service = serviceRepository.findById(applicationDTO.getServiceId())
                .orElseThrow(() -> new RuntimeException("Service not found with ID: " + applicationDTO.getServiceId()));

        Application application = new Application();
        application.setUser(user);
        application.setCitizenProfile(profile);
        application.setService(service);
        application.setSubmissionDate(LocalDate.now());
        application.setStatus(Application.ApplicationStatus.PENDING);
        application.setPaymentStatus(Application.PaymentStatus.PENDING);
        application.setServiceSpecificData(applicationDTO.getServiceSpecificData());

        return applicationRepository.save(application);
    }

    @Transactional(readOnly = true)
    public List<ApplicationListItemDTO> getApplicationsByUserEmail(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Application> applications = applicationRepository.findAllByUser(user);
        
        return applications.stream()
                .map(this::mapEntityToListItemDto)
                .collect(Collectors.toList());
    }

    // --- NEW METHOD ---
    @Transactional(readOnly = true)
    public Application getApplicationByIdForUser(Long applicationId, String userEmail) {
        Application application = applicationRepository.findById(applicationId)
            .orElseThrow(() -> new RuntimeException("Application not found with ID: " + applicationId));
        
        // Security check: ensure the application belongs to the requesting user
        if (!application.getUser().getEmail().equals(userEmail)) {
            throw new AccessDeniedException("You do not have permission to view this application.");
        }
        
        return application;
    }

    private ApplicationListItemDTO mapEntityToListItemDto(Application application) {
        ApplicationListItemDTO dto = new ApplicationListItemDTO();
        dto.setApplicationId(application.getApplicationId());
        dto.setServiceName(application.getService().getServiceName());
        dto.setSubmissionDate(application.getSubmissionDate());
        dto.setStatus(application.getStatus());
        dto.setPaymentStatus(application.getPaymentStatus());
         dto.setServiceSpecificData(application.getServiceSpecificData()); // Add this line
        return dto;
    }
}

