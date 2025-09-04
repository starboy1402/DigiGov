package com.govportal.backend.repository;

import com.govportal.backend.entity.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {
    // Spring Data JPA will provide all basic CRUD methods
}
