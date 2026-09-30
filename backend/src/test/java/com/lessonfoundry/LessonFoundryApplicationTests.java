package com.lessonfoundry;

import com.lessonfoundry.audit.AuditAction;
import com.lessonfoundry.audit.AuditLog;
import com.lessonfoundry.audit.AuditService;
import com.lessonfoundry.auth.AuthService;
import com.lessonfoundry.auth.Role;
import com.lessonfoundry.auth.User;
import com.lessonfoundry.auth.UserRepository;
import com.lessonfoundry.auth.dto.AuthResponse;
import com.lessonfoundry.auth.dto.LoginRequest;
import com.lessonfoundry.auth.dto.RegisterRequest;
import com.lessonfoundry.config.JwtUtils;
import com.lessonfoundry.learning.*;
import com.lessonfoundry.learning.dto.CreatePackRequest;
import com.lessonfoundry.learning.dto.ObjectiveDto;
import com.lessonfoundry.source.Source;
import com.lessonfoundry.source.SourceService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@SpringBootTest
class LessonFoundryApplicationTests {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private SourceService sourceService;

    @Autowired
    private LearningService learningService;

    @Autowired
    private LearningAssetRepository assetRepository;

    @Autowired
    private AssetVersionRepository assetVersionRepository;

    @Autowired
    private AuditService auditService;

    @Test
    void contextLoads() {
        Assertions.assertNotNull(authService);
    }

    @Test
    @Transactional
    void testUserRegistrationAndLogin() {
        RegisterRequest regReq = new RegisterRequest();
        regReq.setEmail("test_teacher@example.com");
        regReq.setFullName("Test Teacher");
        regReq.setPassword("secretPass123");
        regReq.setRole(Role.TEACHER);

        AuthResponse regResp = authService.register(regReq);
        Assertions.assertNotNull(regResp.getToken());
        Assertions.assertEquals("test_teacher@example.com", regResp.getUser().getEmail());
        Assertions.assertEquals(Role.TEACHER, regResp.getUser().getRole());

        // Test JWT validity
        Assertions.assertTrue(jwtUtils.validateToken(regResp.getToken()));
        Assertions.assertEquals("test_teacher@example.com", jwtUtils.getEmailFromToken(regResp.getToken()));
        Assertions.assertEquals("TEACHER", jwtUtils.getRoleFromToken(regResp.getToken()));

        // Test Login
        LoginRequest loginReq = new LoginRequest();
        loginReq.setEmail("test_teacher@example.com");
        loginReq.setPassword("secretPass123");
        AuthResponse loginResp = authService.login(loginReq);
        Assertions.assertNotNull(loginResp.getToken());
    }

    @Test
    @Transactional
    void testSourceAndLearningPackCreation() {
        User teacher = userRepository.findByEmail("teacher@example.com").orElseGet(() -> {
            User u = new User("teacher@example.com", passwordEncoder.encode("password123"), "Prof. Teacher", Role.TEACHER);
            return userRepository.save(u);
        });

        Source src = sourceService.createAndProcessSource(
                "Test Physics Chapter",
                "Kinematics and Newton laws",
                null,
                "Force equals mass times acceleration: F = m * a. Velocity is derivative of position.",
                teacher
        );

        Assertions.assertNotNull(src.getId());
        Assertions.assertEquals("Test Physics Chapter", src.getTitle());
        Assertions.assertTrue(src.getTextContent().contains("F = m * a"));

        CreatePackRequest packReq = new CreatePackRequest();
        packReq.setSourceId(src.getId());
        packReq.setTopic("Newton's Second Law");
        packReq.setGradeLevel("Grade 9");
        packReq.setDifficulty("Intermediate");
        packReq.setObjectives(List.of(
                new ObjectiveDto(null, "OBJ-1", "Define Newton's second law."),
                new ObjectiveDto(null, "OBJ-2", "Calculate force given mass and acceleration.")
        ));

        LearningPack pack = learningService.createPack(packReq, teacher);
        Assertions.assertNotNull(pack.getId());
        Assertions.assertEquals(PackStatus.DRAFT, pack.getStatus());
        Assertions.assertEquals("Newton's Second Law", pack.getTopic());
    }

    @Test
    @Transactional
    void testAssetApprovalAndAuditLogging() {
        User teacher = userRepository.findByEmail("teacher@example.com").orElseGet(() -> {
            User u = new User("teacher@example.com", passwordEncoder.encode("password123"), "Prof. Teacher", Role.TEACHER);
            return userRepository.save(u);
        });

        LearningAsset asset = new LearningAsset();
        asset.setPackId("pack-test-1");
        asset.setAssetType(AssetType.EXPLANATION);
        asset.setTitle("Concept Explanation: Gravity");
        asset.setContentJson("{\"text\": \"Gravity pulls masses together.\"}");
        asset.setStatus(AssetStatus.DRAFT);
        asset.setCurrentVersion(1);
        asset.setLastModifiedBy(teacher.getEmail());
        asset = assetRepository.save(asset);

        LearningAsset approved = learningService.approveAsset(asset.getId(), teacher);
        Assertions.assertEquals(AssetStatus.APPROVED, approved.getStatus());

        List<AssetVersion> versions = assetVersionRepository.findByAssetIdOrderByVersionNumberDesc(asset.getId());
        Assertions.assertFalse(versions.isEmpty());

        List<AuditLog> logs = auditService.getAllLogs();
        Assertions.assertFalse(logs.isEmpty());
    }
}
