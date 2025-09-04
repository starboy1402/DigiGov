package com.govportal.backend.repository;

import com.govportal.backend.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    // Spring Data JPA will provide all basic CRUD methods
}
