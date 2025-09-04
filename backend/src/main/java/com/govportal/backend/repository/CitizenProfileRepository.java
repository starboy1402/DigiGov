package com.govportal.backend.repository;

import com.govportal.backend.entity.CitizenProfile;
import com.govportal.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CitizenProfileRepository extends JpaRepository<CitizenProfile, Long> {
    
    Optional<CitizenProfile> findByUser(User user);

    Optional<CitizenProfile> findByUserEmail(String email);
}

