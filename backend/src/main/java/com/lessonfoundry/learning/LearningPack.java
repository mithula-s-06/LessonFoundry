package com.lessonfoundry.learning;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "learning_packs")
public class LearningPack {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String topic;

    @Column(nullable = false)
    private String gradeLevel;

    @Column(nullable = false)
    private String difficulty; // Beginner, Intermediate, Advanced

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PackStatus status = PackStatus.IN_REVIEW;

    @Column(nullable = false)
    private String sourceId;

    private String sourceTitle;

    @Column(nullable = false)
    private String createdBy; // Teacher Email

    private int quizQuestionCount = 5;
    private int easyPracticeCount = 3;
    private int advancedPracticeCount = 3;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    private LocalDateTime publishedAt;

    public LearningPack() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public String getGradeLevel() { return gradeLevel; }
    public void setGradeLevel(String gradeLevel) { this.gradeLevel = gradeLevel; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public PackStatus getStatus() { return status; }
    public void setStatus(PackStatus status) { this.status = status; }

    public String getSourceId() { return sourceId; }
    public void setSourceId(String sourceId) { this.sourceId = sourceId; }

    public String getSourceTitle() { return sourceTitle; }
    public void setSourceTitle(String sourceTitle) { this.sourceTitle = sourceTitle; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public int getQuizQuestionCount() { return quizQuestionCount; }
    public void setQuizQuestionCount(int quizQuestionCount) { this.quizQuestionCount = quizQuestionCount; }

    public int getEasyPracticeCount() { return easyPracticeCount; }
    public void setEasyPracticeCount(int easyPracticeCount) { this.easyPracticeCount = easyPracticeCount; }

    public int getAdvancedPracticeCount() { return advancedPracticeCount; }
    public void setAdvancedPracticeCount(int advancedPracticeCount) { this.advancedPracticeCount = advancedPracticeCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public LocalDateTime getPublishedAt() { return publishedAt; }
    public void setPublishedAt(LocalDateTime publishedAt) { this.publishedAt = publishedAt; }
}
