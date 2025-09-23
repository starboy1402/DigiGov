package com.govportal.backend.controller;

import com.govportal.backend.dto.AdminApplicationListItemDTO;
import com.govportal.backend.dto.DashboardStatsDTO;
import com.govportal.backend.service.AdminService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/applications")
    public ResponseEntity<List<AdminApplicationListItemDTO>> getAllApplications() {
        return ResponseEntity.ok(adminService.getAllApplications());
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        return ResponseEntity.ok(adminService.getApplicationStats());
    }

    @PutMapping("/applications/{id}/approve")
    public ResponseEntity<AdminApplicationListItemDTO> approveApplication(@PathVariable Long id, Authentication principal) {
        String adminUsername = principal.getName();
        return ResponseEntity.ok(adminService.approveApplication(id, adminUsername));
    }

    @PutMapping("/applications/{id}/reject")
    public ResponseEntity<AdminApplicationListItemDTO> rejectApplication(@PathVariable Long id, Authentication principal) {
        String adminUsername = principal.getName();
        return ResponseEntity.ok(adminService.rejectApplication(id, adminUsername));
    }
}

