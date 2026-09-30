package com.lessonfoundry.learning;

import com.lessonfoundry.auth.User;
import com.lessonfoundry.learning.dto.CreatePackRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/packs")
public class LearningPackController {

    @Autowired
    private LearningService learningService;

    @GetMapping
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<List<LearningPack>> getPacks(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(learningService.getPacksForUser(user));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN', 'STUDENT')")
    public ResponseEntity<Map<String, Object>> getPackDetails(@PathVariable String id) {
        return ResponseEntity.ok(learningService.getFullPackDetails(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<LearningPack> createPack(
            @Valid @RequestBody CreatePackRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(learningService.createPack(request, user));
    }

    @PostMapping("/{id}/generate")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<LearningPack> generatePackContent(
            @PathVariable String id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(learningService.generatePackContent(id, user));
    }

    @PostMapping("/{id}/publish")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<LearningPack> publishPack(
            @PathVariable String id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(learningService.publishPack(id, user));
    }

    @GetMapping("/student/published")
    public ResponseEntity<List<LearningPack>> getPublishedPacksForStudents() {
        return ResponseEntity.ok(learningService.getPublishedPacks());
    }
}
