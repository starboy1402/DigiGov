package com.govportal.backend.repository;

import com.govportal.backend.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    // SQL: SELECT * FROM feedback WHERE status = ?;
    List<Feedback> findByStatus(Feedback.FeedbackStatus status);

    // SQL: SELECT * FROM feedback WHERE feedback_type = ?;
    List<Feedback> findByFeedbackType(Feedback.FeedbackType feedbackType);
}
