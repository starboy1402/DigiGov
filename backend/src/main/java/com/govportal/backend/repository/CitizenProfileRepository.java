package com.govportal.backend.repository;

import com.govportal.backend.entity.CitizenProfile;
import com.govportal.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CitizenProfileRepository extends JpaRepository<CitizenProfile, Long> {

    // SQL: SELECT * FROM citizen_profiles WHERE user_id = ?;
    Optional<CitizenProfile> findByUser(User user);

    // SQL: SELECT * FROM citizen_profiles WHERE user_email = ?;
    Optional<CitizenProfile> findByUserEmail(String email);
}
