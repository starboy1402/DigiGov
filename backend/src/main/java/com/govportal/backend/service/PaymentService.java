// ...existing code...
package com.govportal.backend.service;

import com.govportal.backend.dto.PaymentDTO;
import com.govportal.backend.entity.Application;
import com.govportal.backend.entity.Payment;
import com.govportal.backend.repository.ApplicationRepository;
import com.govportal.backend.repository.PaymentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

@Service
public class PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);

    private final PaymentRepository paymentRepository;
    private final ApplicationRepository applicationRepository;

    public PaymentService(PaymentRepository paymentRepository, ApplicationRepository applicationRepository) {
        this.paymentRepository = paymentRepository;
        this.applicationRepository = applicationRepository;
    }

    @Transactional
    public Payment processPayment(PaymentDTO paymentDTO) {
        Application application = applicationRepository.findById(paymentDTO.getApplicationId())
                .orElseThrow(() -> new RuntimeException("Application not found with ID: " + paymentDTO.getApplicationId()));

        // Prevent duplicate payments for same application
        if (application.getPayment() != null) {
            throw new RuntimeException("Payment already exists for this application");
        }

        // Prevent duplicate transaction id submissions
        paymentRepository.findByTransactionId(paymentDTO.getTransactionId())
                .ifPresent(p -> { throw new RuntimeException("This transaction ID was already used"); });

        Payment payment = new Payment();
        payment.setApplication(application); // owning side set
        payment.setAmount(paymentDTO.getAmount());
        payment.setPaymentMethod(paymentDTO.getPaymentMethod());
        payment.setTransactionId(paymentDTO.getTransactionId());
        payment.setStatus(Payment.PaymentStatus.COMPLETED); // or PENDING if you process asynchronously
        payment.setPaymentDate(new Date());

        try {
            // Save payment (owning side). Because cascade = ALL on Application.payment, setting app.setPayment(...) is optional for persistence,
            // but we set both sides for in-memory consistency.
            Payment saved = paymentRepository.save(payment);

            // maintain bidirectional relation and update application payment status
            application.setPayment(saved);
            application.setPaymentStatus(Application.PaymentStatus.COMPLETED);
            applicationRepository.save(application);

            return saved;
        } catch (Exception ex) {
            logger.error("Failed to process payment for application {}: {}", application.getApplicationId(), ex.getMessage(), ex);
            throw new RuntimeException("Failed to process payment");
        }
    }
}
// ...existing code...