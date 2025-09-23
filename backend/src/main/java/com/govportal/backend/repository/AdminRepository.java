package com.govportal.backend.repository;

import com.govportal.backend.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AdminRepository extends JpaRepository<Admin, Long> {
    // SQL: SELECT * FROM admins WHERE username = ?;
    Optional<Admin> findByUsername(String username);
}
