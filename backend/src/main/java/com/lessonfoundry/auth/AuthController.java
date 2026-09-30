package com.lessonfoundry.auth;

import com.lessonfoundry.auth.dto.AuthResponse;
import com.lessonfoundry.auth.dto.LoginRequest;
import com.lessonfoundry.auth.dto.RegisterRequest;
import com.lessonfoundry.auth.dto.UserDto;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@AuthenticationPrincipal User user) {
        authService.logout(user);
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(authService.getProfile(user));
    }

    @GetMapping("/profile")
    public ResponseEntity<UserDto> getProfile(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(authService.getProfile(user));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserDto> updateProfile(
            @Valid @RequestBody com.lessonfoundry.auth.dto.UpdateProfileRequest request,
            @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(authService.updateProfile(user, request));
    }
}
