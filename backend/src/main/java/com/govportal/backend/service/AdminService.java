package com.govportal.backend.service;

import com.govportal.backend.dto.AdminApplicationListItemDTO;
import com.govportal.backend.dto.DashboardStatsDTO;
import com.govportal.backend.entity.Admin;
import com.govportal.backend.entity.Application;
import com.govportal.backend.repository.AdminRepository;
import com.govportal.backend.repository.ApplicationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final ApplicationRepository applicationRepository;
    private final AdminRepository adminRepository;

    public AdminService(ApplicationRepository applicationRepository, AdminRepository adminRepository) {
        this.applicationRepository = applicationRepository;
        this.adminRepository = adminRepository;
    }

    @Transactional(readOnly = true)
    public List<AdminApplicationListItemDTO> getAllApplications() {
        return applicationRepository.findAll().stream()
                .map(this::mapEntityToAdminDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DashboardStatsDTO getApplicationStats() {
        long total = applicationRepository.count();
        long pending = applicationRepository.countByStatus(Application.ApplicationStatus.PENDING);
        long approved = applicationRepository.countByStatus(Application.ApplicationStatus.APPROVED);
        long rejected = applicationRepository.countByStatus(Application.ApplicationStatus.REJECTED);
        return new DashboardStatsDTO(total, pending, approved, rejected);
    }

    @Transactional
    public AdminApplicationListItemDTO approveApplication(Long applicationId, String adminUsername) {
        Application application = findApplicationById(applicationId);
        Admin admin = findAdminByUsername(adminUsername);

        if (application.getPaymentStatus() != Application.PaymentStatus.COMPLETED) {
            throw new IllegalStateException("Cannot approve an application with a pending payment.");
        }

        application.setStatus(Application.ApplicationStatus.APPROVED);
        application.setAdmin(admin);
        Application updatedApplication = applicationRepository.save(application);
        return mapEntityToAdminDto(updatedApplication);
    }

    @Transactional
    public AdminApplicationListItemDTO rejectApplication(Long applicationId, String adminUsername) {
        Application application = findApplicationById(applicationId);
        Admin admin = findAdminByUsername(adminUsername);
        
        application.setStatus(Application.ApplicationStatus.REJECTED);
        application.setAdmin(admin);
        Application updatedApplication = applicationRepository.save(application);
        return mapEntityToAdminDto(updatedApplication);
    }

    private Application findApplicationById(Long applicationId) {
        return applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found with ID: " + applicationId));
    }

    private Admin findAdminByUsername(String username) {
        return adminRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Admin not found with username: " + username));
    }

    private AdminApplicationListItemDTO mapEntityToAdminDto(Application app) {
        AdminApplicationListItemDTO dto = new AdminApplicationListItemDTO();
        dto.setApplicationId(app.getApplicationId());
        dto.setUserId(app.getUser().getId());
        dto.setServiceName(app.getService().getServiceName());
        dto.setSubmissionDate(app.getSubmissionDate());
        dto.setStatus(app.getStatus());
        dto.setPaymentStatus(app.getPaymentStatus());
        dto.setServiceSpecificData(app.getServiceSpecificData());
        if (app.getCitizenProfile() != null) {
            dto.setApplicantName(app.getCitizenProfile().getName());
            dto.setFathersName(app.getCitizenProfile().getFathersName());
            dto.setMothersName(app.getCitizenProfile().getMothersName());
            dto.setDateOfBirth(app.getCitizenProfile().getDateOfBirth());
            dto.setNidNumber(app.getCitizenProfile().getNidNumber());
            dto.setProfession(app.getCitizenProfile().getProfession());
        }
        return dto;
    }
}

