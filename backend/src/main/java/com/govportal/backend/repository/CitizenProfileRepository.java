package com.govportal.backend.repository;

import com.govportal.backend.entity.CitizenProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CitizenProfileRepository extends JpaRepository<CitizenProfile, Long> {
    Optional<CitizenProfile> findByUserEmail(String email);
}
