package com.lessonfoundry.user;

import com.lessonfoundry.audit.AuditAction;
import com.lessonfoundry.audit.AuditService;
import com.lessonfoundry.auth.Role;
import com.lessonfoundry.auth.User;
import com.lessonfoundry.auth.UserRepository;
import com.lessonfoundry.auth.dto.UserDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuditService auditService;

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(u -> new UserDto(u.getId(), u.getEmail(), u.getFullName(), u.getRole(), u.isEnabled(), u.getCreatedAt(), u.getLastLoginAt()))
                .collect(Collectors.toList());
    }

    public UserDto getUserById(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        return new UserDto(user.getId(), user.getEmail(), user.getFullName(), user.getRole(), user.isEnabled(), user.getCreatedAt(), user.getLastLoginAt());
    }

    @Transactional
    public void deleteUser(String userId, User performedBy) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        if (performedBy != null && user.getId().equals(performedBy.getId())) {
            throw new IllegalArgumentException("Cannot delete your own active administrator account.");
        }

        userRepository.delete(user);

        if (performedBy != null) {
            auditService.record(
                    AuditAction.USER_STATUS_CHANGED,
                    performedBy.getEmail(),
                    performedBy.getRole().name(),
                    "USER",
                    user.getId(),
                    "Deleted user account: " + user.getEmail() + " (" + user.getFullName() + ", Role: " + user.getRole() + ")"
            );
        }
    }

    @Transactional
    public UserDto updateUserRole(String userId, Role newRole, User performedBy) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        Role oldRole = user.getRole();
        user.setRole(newRole);
        user = userRepository.save(user);

        auditService.record(
                AuditAction.USER_ROLE_CHANGED,
                performedBy.getEmail(),
                performedBy.getRole().name(),
                "USER",
                user.getId(),
                "Changed role for user " + user.getEmail() + " from " + oldRole + " to " + newRole
        );

        return new UserDto(user.getId(), user.getEmail(), user.getFullName(), user.getRole(), user.isEnabled(), user.getCreatedAt(), user.getLastLoginAt());
    }

    @Transactional
    public UserDto updateUserStatus(String userId, boolean enabled, User performedBy) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        user.setEnabled(enabled);
        user = userRepository.save(user);

        auditService.record(
                AuditAction.USER_STATUS_CHANGED,
                performedBy.getEmail(),
                performedBy.getRole().name(),
                "USER",
                user.getId(),
                (enabled ? "Enabled" : "Disabled") + " account for " + user.getEmail()
        );

        return new UserDto(user.getId(), user.getEmail(), user.getFullName(), user.getRole(), user.isEnabled(), user.getCreatedAt(), user.getLastLoginAt());
    }

    public Map<String, Object> getUserStatistics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalTeachers", userRepository.countByRole(Role.TEACHER));
        stats.put("totalStudents", userRepository.countByRole(Role.STUDENT));
        stats.put("totalAdmins", userRepository.countByRole(Role.ADMIN));
        return stats;
    }
}
