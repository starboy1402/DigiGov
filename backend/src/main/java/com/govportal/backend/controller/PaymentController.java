package com.govportal.backend.controller;

import com.govportal.backend.dto.PaymentDTO;
import com.govportal.backend.entity.Payment;
import com.govportal.backend.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping
    public ResponseEntity<Payment> submitPayment(@Valid @RequestBody PaymentDTO paymentDTO) {
       Payment processedPayment = paymentService.processPayment(paymentDTO);
       return ResponseEntity.status(org.springframework.http.HttpStatus.CREATED).body(processedPayment);
    }
}
