package com.lessonfoundry.auth.dto;

import com.lessonfoundry.auth.Role;
import java.time.LocalDateTime;

public class UserDto {
    private String id;
    private String email;
    private String fullName;
    private Role role;
    private boolean enabled;
    private LocalDateTime createdAt;
    private LocalDateTime lastLoginAt;

    public UserDto() {}

    public UserDto(String id, String email, String fullName, Role role, boolean enabled) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.enabled = enabled;
    }

    public UserDto(String id, String email, String fullName, Role role, boolean enabled, LocalDateTime createdAt, LocalDateTime lastLoginAt) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.enabled = enabled;
        this.createdAt = createdAt;
        this.lastLoginAt = lastLoginAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getLastLoginAt() { return lastLoginAt; }
    public void setLastLoginAt(LocalDateTime lastLoginAt) { this.lastLoginAt = lastLoginAt; }
}
