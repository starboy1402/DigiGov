package com.govportal.backend.security;

import com.govportal.backend.entity.Admin;
import com.govportal.backend.entity.User;
import com.govportal.backend.repository.AdminRepository;
import com.govportal.backend.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final AdminRepository adminRepository;

    public CustomUserDetailsService(UserRepository userRepository, AdminRepository adminRepository) {
        this.userRepository = userRepository;
        this.adminRepository = adminRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // First, try to find a regular user by email
        User user = userRepository.findByEmail(username).orElse(null);
        if (user != null) {
            return new org.springframework.security.core.userdetails.User(
                user.getEmail(), 
                user.getPassword(), // Use getPassword() to match your entity
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
            );
        }

        // If not a regular user, try to find an admin by username
        Admin admin = adminRepository.findByUsername(username).orElse(null);
        if (admin != null) {
            return new org.springframework.security.core.userdetails.User(
                admin.getUsername(), 
                admin.getPassword(), // Use getPassword() to match your entity
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN"))
            );
        }

        throw new UsernameNotFoundException("User or Admin not found with username/email: " + username);
    }
}

