package com.lessonfoundry.user;

import com.lessonfoundry.auth.Role;
import com.lessonfoundry.auth.User;
import com.lessonfoundry.auth.dto.UserDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDto> getUserById(@PathVariable String id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteUser(
            @PathVariable String id,
            @AuthenticationPrincipal User adminUser) {
        userService.deleteUser(id, adminUser);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully", "userId", id));
    }

    @PatchMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDto> updateUserRole(
            @PathVariable String id,
            @RequestBody Map<String, String> payload,
            @AuthenticationPrincipal User adminUser) {
        String roleStr = payload.get("role");
        Role newRole = Role.valueOf(roleStr.toUpperCase());
        return ResponseEntity.ok(userService.updateUserRole(id, newRole, adminUser));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDto> updateUserStatus(
            @PathVariable String id,
            @RequestBody Map<String, Boolean> payload,
            @AuthenticationPrincipal User adminUser) {
        Boolean enabled = payload.get("enabled");
        return ResponseEntity.ok(userService.updateUserStatus(id, Boolean.TRUE.equals(enabled), adminUser));
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getUserStats() {
        return ResponseEntity.ok(userService.getUserStatistics());
    }
}
