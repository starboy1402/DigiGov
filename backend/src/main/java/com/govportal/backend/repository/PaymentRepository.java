package com.govportal.backend.repository;

import com.govportal.backend.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    // optional helper to detect duplicate transaction submissions
    // SQL: SELECT * FROM payments WHERE transaction_id = ?;
    Optional<Payment> findByTransactionId(String transactionId);
}