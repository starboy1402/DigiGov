package com.govportal.backend.dto;

import com.govportal.backend.entity.Payment;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PaymentDTO {
    @NotNull(message = "Application ID is required")
    private Long applicationId;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Amount must be positive")
    private BigDecimal amount;

    @NotNull(message = "Payment method is required")
    private Payment.PaymentMethod paymentMethod;

    @NotEmpty(message = "Transaction ID is required")
    private String transactionId;
}
