package com.govportal.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;
import java.util.Map;

@Entity
@Table(name = "applications")
@Data
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "application_id")
    private Long applicationId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "citizen_profile_id", nullable = false)
    private CitizenProfile citizenProfile;

    @ManyToOne
    @JoinColumn(name = "service_id", nullable = false)
    private Service service;

    @ManyToOne
    @JoinColumn(name = "admin_id")
    private Admin admin;

    @Column(name = "submission_date", nullable = false)
    private LocalDate submissionDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "service_specific_data", columnDefinition = "json")
    private Map<String, Object> serviceSpecificData;

    public enum ApplicationStatus {
        PENDING, APPROVED, REJECTED
    }
}
