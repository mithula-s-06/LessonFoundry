package com.lessonfoundry.learning;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/validation")
public class ValidationController {

    @Autowired
    private ValidationResultRepository validationRepository;

    @Autowired
    private AlignmentRecordRepository alignmentRepository;

    @GetMapping("/pack/{packId}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<ValidationResult> getValidationResult(@PathVariable String packId) {
        return ResponseEntity.ok(validationRepository.findByPackId(packId)
                .orElse(new ValidationResult(packId, "PENDING", 0, 0, 0, "[]")));
    }

    @GetMapping("/alignment/{packId}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<List<AlignmentRecord>> getAlignmentRecords(@PathVariable String packId) {
        return ResponseEntity.ok(alignmentRepository.findByPackId(packId));
    }
}
