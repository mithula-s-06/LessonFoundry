package com.lessonfoundry.audit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AuditService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Transactional
    public void record(AuditAction action, String performedBy, String userRole, String resourceType, String resourceId, String details) {
        try {
            AuditLog log = new AuditLog(action, performedBy, userRole, resourceType, resourceId, details);
            auditLogRepository.save(log);
        } catch (Exception e) {
            System.err.println("Failed to write audit log: " + e.getMessage());
        }
    }

    public List<AuditLog> getAllLogs() {
        return auditLogRepository.findAllByOrderByTimestampDesc();
    }

    public List<AuditLog> getLogsByUser(String userEmail) {
        return auditLogRepository.findByPerformedByOrderByTimestampDesc(userEmail);
    }
}
