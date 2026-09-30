package com.lessonfoundry.source;

import com.lessonfoundry.auth.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sources")
public class SourceController {

    @Autowired
    private SourceService sourceService;

    @GetMapping
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<List<Source>> getSources(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(sourceService.getSourcesForUser(user));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<Source> getSourceById(@PathVariable String id) {
        return ResponseEntity.ok(sourceService.getSourceById(id));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<Source> uploadSource(
            @RequestParam("title") String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "rawText", required = false) String rawText,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(sourceService.createAndProcessSource(title, description, file, rawText, user));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<?> deleteSource(@PathVariable String id, @AuthenticationPrincipal User user) {
        sourceService.deleteSource(id, user);
        return ResponseEntity.ok(Map.of("message", "Source deleted successfully", "id", id));
    }
}
