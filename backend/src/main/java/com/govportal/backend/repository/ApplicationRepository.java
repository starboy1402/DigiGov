package com.govportal.backend.repository;

import com.govportal.backend.entity.Admin;
import com.govportal.backend.entity.Application;
import com.govportal.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    // SQL: SELECT * FROM applications WHERE user_id = ?;
    List<Application> findAllByUser(User user);

    // SQL: SELECT COUNT(*) FROM applications WHERE status = ?;
    long countByStatus(Application.ApplicationStatus status);

    // SQL: SELECT * FROM applications WHERE status = ?;
    List<Application> findByStatus(Application.ApplicationStatus status);

    // SQL: SELECT * FROM applications WHERE admin_id = ?;
    List<Application> findByAdmin(Admin admin);
}
