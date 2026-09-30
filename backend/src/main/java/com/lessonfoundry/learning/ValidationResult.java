package com.lessonfoundry.learning;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "validation_results")
public class ValidationResult {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, unique = true)
    private String packId;

    @Column(nullable = false)
    private String overallStatus; // PASS, NEEDS_REVIEW

    private int passedChecksCount;
    private int warningCount;
    private int errorCount;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String issuesJson;

    private LocalDateTime evaluatedAt = LocalDateTime.now();

    public ValidationResult() {}

    public ValidationResult(String packId, String overallStatus, int passedChecksCount, int warningCount, int errorCount, String issuesJson) {
        this.packId = packId;
        this.overallStatus = overallStatus;
        this.passedChecksCount = passedChecksCount;
        this.warningCount = warningCount;
        this.errorCount = errorCount;
        this.issuesJson = issuesJson;
        this.evaluatedAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPackId() { return packId; }
    public void setPackId(String packId) { this.packId = packId; }

    public String getOverallStatus() { return overallStatus; }
    public void setOverallStatus(String overallStatus) { this.overallStatus = overallStatus; }

    public int getPassedChecksCount() { return passedChecksCount; }
    public void setPassedChecksCount(int passedChecksCount) { this.passedChecksCount = passedChecksCount; }

    public int getWarningCount() { return warningCount; }
    public void setWarningCount(int warningCount) { this.warningCount = warningCount; }

    public int getErrorCount() { return errorCount; }
    public void setErrorCount(int errorCount) { this.errorCount = errorCount; }

    public String getIssuesJson() { return issuesJson; }
    public void setIssuesJson(String issuesJson) { this.issuesJson = issuesJson; }

    public LocalDateTime getEvaluatedAt() { return evaluatedAt; }
    public void setEvaluatedAt(LocalDateTime evaluatedAt) { this.evaluatedAt = evaluatedAt; }
}
