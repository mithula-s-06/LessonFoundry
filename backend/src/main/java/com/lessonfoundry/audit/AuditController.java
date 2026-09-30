package com.lessonfoundry.audit;

import com.lessonfoundry.auth.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit")
public class AuditController {

    @Autowired
    private AuditService auditService;

    @GetMapping
    public ResponseEntity<List<AuditLog>> getAuditLogs(@AuthenticationPrincipal User user) {
        if (user.getRole().name().equals("ADMIN")) {
            return ResponseEntity.ok(auditService.getAllLogs());
        } else {
            return ResponseEntity.ok(auditService.getLogsByUser(user.getEmail()));
        }
    }
}
