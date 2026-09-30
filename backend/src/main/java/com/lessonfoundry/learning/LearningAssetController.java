package com.lessonfoundry.learning;

import com.lessonfoundry.auth.User;
import com.lessonfoundry.learning.dto.RegenerateAssetRequest;
import com.lessonfoundry.learning.dto.ReviewActionRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assets")
public class LearningAssetController {

    @Autowired
    private LearningService learningService;

    @Autowired
    private LearningAssetRepository assetRepository;

    @Autowired
    private AssetVersionRepository assetVersionRepository;

    @Autowired
    private ProvenanceReferenceRepository provenanceRepository;

    @GetMapping("/{id}")
    public ResponseEntity<LearningAsset> getAsset(@PathVariable String id) {
        return ResponseEntity.ok(assetRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Asset not found with id: " + id)));
    }

    @PostMapping("/{id}/regenerate")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<LearningAsset> regenerateAsset(
            @PathVariable String id,
            @Valid @RequestBody RegenerateAssetRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(learningService.regenerateSingleAsset(id, request, user));
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<LearningAsset> approveAsset(
            @PathVariable String id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(learningService.approveAsset(id, user));
    }

    @PostMapping("/{id}/request-revision")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<LearningAsset> requestRevision(
            @PathVariable String id,
            @RequestBody ReviewActionRequest request,
            @AuthenticationPrincipal User user) {
        String reason = request != null && request.getReason() != null ? request.getReason() : "Teacher requested revisions.";
        return ResponseEntity.ok(learningService.requestRevision(id, reason, user));
    }

    @GetMapping("/{id}/versions")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<List<AssetVersion>> getAssetVersions(@PathVariable String id) {
        return ResponseEntity.ok(assetVersionRepository.findByAssetIdOrderByVersionNumberDesc(id));
    }

    @GetMapping("/{id}/provenance")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<List<ProvenanceReference>> getAssetProvenance(@PathVariable String id) {
        return ResponseEntity.ok(provenanceRepository.findByAssetId(id));
    }
}
