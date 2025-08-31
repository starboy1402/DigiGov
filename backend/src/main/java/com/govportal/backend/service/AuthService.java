package com.govportal.backend.service;

import com.govportal.backend.dto.AdminLoginDTO;
import com.govportal.backend.dto.AuthResponseDTO;
import com.govportal.backend.dto.LoginDTO;
import com.govportal.backend.dto.SignUpDTO;
import com.govportal.backend.entity.Admin;
import com.govportal.backend.entity.User;
import com.govportal.backend.repository.AdminRepository;
import com.govportal.backend.repository.UserRepository;
import com.govportal.backend.security.JwtTokenProvider;

import java.util.HashMap;
import java.util.Map;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(UserRepository userRepository, AdminRepository adminRepository, PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public User signUp(SignUpDTO signUpDTO) {
        if (userRepository.findByEmail(signUpDTO.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists!");
        }

        User user = new User();
        user.setEmail(signUpDTO.getEmail());
        user.setPhone(signUpDTO.getPhone());
        user.setPassword(passwordEncoder.encode(signUpDTO.getPassword()));

        return userRepository.save(user);
    }

    public AuthResponseDTO login(LoginDTO loginDTO) {
        User user = userRepository.findByEmail(loginDTO.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found!"));

        if (!passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password!");
        }

        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("role", "ROLE_USER");
        String token = jwtTokenProvider.generateToken(user.getEmail(), claims);
        return AuthResponseDTO.builder()
            .token(token)
            .userId(user.getId())
            .email(user.getEmail())
            .build();
    }

    public AuthResponseDTO adminLogin(AdminLoginDTO adminLoginDTO) {
        Admin admin = adminRepository.findByUsername(adminLoginDTO.getUsername())
                .orElseThrow(() -> new RuntimeException("Admin not found!"));

        if (!passwordEncoder.matches(adminLoginDTO.getPassword(), admin.getPassword())) {
            throw new RuntimeException("Invalid admin password!");
        }

        Map<String, Object> claims = new HashMap<>();
        claims.put("adminId", admin.getId());
        claims.put("role", "ROLE_ADMIN");
        String token = jwtTokenProvider.generateToken(admin.getUsername(), claims);
        return AuthResponseDTO.builder()
            .token(token)
            .adminId(admin.getId())
            .username(admin.getUsername())
            .build();
    }
}

