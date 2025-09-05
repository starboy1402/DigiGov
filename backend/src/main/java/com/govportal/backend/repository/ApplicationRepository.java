package com.govportal.backend.repository;

import com.govportal.backend.entity.Application;
import com.govportal.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    
    List<Application> findAllByUser(User user);

    long countByStatus(Application.ApplicationStatus status);
}

