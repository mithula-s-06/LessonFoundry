package com.lessonfoundry.learning;

import jakarta.persistence.*;

@Entity
@Table(name = "alignment_records")
public class AlignmentRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String packId;

    @Column(nullable = false)
    private String objectiveId;

    @Column(length = 1000)
    private String objectiveDescription;

    private String explanationCoverage; // COVERED, PARTIALLY_COVERED, NOT_COVERED
    private String exampleCoverage;
    private String quizCoverage;
    private String practiceCoverage;
    private String overallStatus;
    private double coverageScore;

    public AlignmentRecord() {}

    public AlignmentRecord(String packId, String objectiveId, String objectiveDescription, String explanationCoverage, String exampleCoverage, String quizCoverage, String practiceCoverage, String overallStatus, double coverageScore) {
        this.packId = packId;
        this.objectiveId = objectiveId;
        this.objectiveDescription = objectiveDescription;
        this.explanationCoverage = explanationCoverage;
        this.exampleCoverage = exampleCoverage;
        this.quizCoverage = quizCoverage;
        this.practiceCoverage = practiceCoverage;
        this.overallStatus = overallStatus;
        this.coverageScore = coverageScore;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPackId() { return packId; }
    public void setPackId(String packId) { this.packId = packId; }

    public String getObjectiveId() { return objectiveId; }
    public void setObjectiveId(String objectiveId) { this.objectiveId = objectiveId; }

    public String getObjectiveDescription() { return objectiveDescription; }
    public void setObjectiveDescription(String objectiveDescription) { this.objectiveDescription = objectiveDescription; }

    public String getExplanationCoverage() { return explanationCoverage; }
    public void setExplanationCoverage(String explanationCoverage) { this.explanationCoverage = explanationCoverage; }

    public String getExampleCoverage() { return exampleCoverage; }
    public void setExampleCoverage(String exampleCoverage) { this.exampleCoverage = exampleCoverage; }

    public String getQuizCoverage() { return quizCoverage; }
    public void setQuizCoverage(String quizCoverage) { this.quizCoverage = quizCoverage; }

    public String getPracticeCoverage() { return practiceCoverage; }
    public void setPracticeCoverage(String practiceCoverage) { this.practiceCoverage = practiceCoverage; }

    public String getOverallStatus() { return overallStatus; }
    public void setOverallStatus(String overallStatus) { this.overallStatus = overallStatus; }

    public double getCoverageScore() { return coverageScore; }
    public void setCoverageScore(double coverageScore) { this.coverageScore = coverageScore; }
}
