package com.lessonfoundry.auth;

import com.lessonfoundry.audit.AuditAction;
import com.lessonfoundry.audit.AuditService;
import com.lessonfoundry.auth.dto.AuthResponse;
import com.lessonfoundry.auth.dto.LoginRequest;
import com.lessonfoundry.auth.dto.RegisterRequest;
import com.lessonfoundry.auth.dto.UpdateProfileRequest;
import com.lessonfoundry.auth.dto.UserDto;
import com.lessonfoundry.config.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private AuditService auditService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw new IllegalArgumentException("Email is already registered");
        }

        User user = new User();
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName().trim());
        user.setRole(request.getRole() != null ? request.getRole() : Role.TEACHER);
        user.setEnabled(true);
        user.setCreatedAt(LocalDateTime.now());

        user = userRepository.save(user);

        auditService.record(
            AuditAction.USER_REGISTERED,
            user.getEmail(),
            user.getRole().name(),
            "USER",
            user.getId(),
            "Registered new user with role " + user.getRole()
        );

        String token = jwtUtils.generateToken(user.getEmail(), user.getId(), user.getRole().name());
        UserDto userDto = new UserDto(user.getId(), user.getEmail(), user.getFullName(), user.getRole(), user.isEnabled());

        return new AuthResponse(token, userDto);
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!user.isEnabled()) {
            throw new IllegalStateException("Your account has been disabled. Please contact an administrator.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        auditService.record(
            AuditAction.LOGIN,
            user.getEmail(),
            user.getRole().name(),
            "USER",
            user.getId(),
            "User logged in successfully"
        );

        String token = jwtUtils.generateToken(user.getEmail(), user.getId(), user.getRole().name());
        UserDto userDto = new UserDto(user.getId(), user.getEmail(), user.getFullName(), user.getRole(), user.isEnabled());

        return new AuthResponse(token, userDto);
    }

    public void logout(User user) {
        if (user != null) {
            auditService.record(
                AuditAction.LOGOUT,
                user.getEmail(),
                user.getRole().name(),
                "USER",
                user.getId(),
                "User signed out"
            );
        }
    }

    public UserDto getProfile(User user) {
        if (user == null) {
            throw new IllegalArgumentException("User is not authenticated");
        }
        User current = userRepository.findById(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return new UserDto(
                current.getId(),
                current.getEmail(),
                current.getFullName(),
                current.getRole(),
                current.isEnabled(),
                current.getCreatedAt(),
                current.getLastLoginAt()
        );
    }

    @Transactional
    public UserDto updateProfile(User user, UpdateProfileRequest request) {
        if (user == null) {
            throw new IllegalArgumentException("User is not authenticated");
        }
        User current = userRepository.findById(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        StringBuilder changes = new StringBuilder();

        // 1. Update Full Name if provided
        if (request.getFullName() != null && !request.getFullName().trim().isBlank()) {
            String newName = request.getFullName().trim();
            if (!newName.equals(current.getFullName())) {
                changes.append("Updated name from '").append(current.getFullName()).append("' to '").append(newName).append("'. ");
                current.setFullName(newName);
            }
        }

        // 2. Update Password if requested
        if (request.getNewPassword() != null && !request.getNewPassword().trim().isBlank()) {
            String newPass = request.getNewPassword().trim();
            if (newPass.length() < 6) {
                throw new IllegalArgumentException("New password must be at least 6 characters long.");
            }

            // Verify current password
            if (request.getCurrentPassword() == null || request.getCurrentPassword().isBlank()) {
                throw new IllegalArgumentException("Current password is required to set a new password.");
            }
            if (!passwordEncoder.matches(request.getCurrentPassword(), current.getPasswordHash())) {
                throw new IllegalArgumentException("Current password does not match.");
            }

            current.setPasswordHash(passwordEncoder.encode(newPass));
            changes.append("Password changed successfully. ");
        }

        if (changes.length() == 0) {
            changes.append("Profile details verified without modification.");
        }

        current = userRepository.save(current);

        auditService.record(
            AuditAction.USER_STATUS_CHANGED,
            current.getEmail(),
            current.getRole().name(),
            "USER",
            current.getId(),
            "Profile updated: " + changes.toString().trim()
        );

        return new UserDto(
                current.getId(),
                current.getEmail(),
                current.getFullName(),
                current.getRole(),
                current.isEnabled(),
                current.getCreatedAt(),
                current.getLastLoginAt()
        );
    }
}

