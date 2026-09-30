package com.lessonfoundry.learning;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "student_submissions")
public class StudentSubmission {

    @Id
    private String id;

    @Column(nullable = false)
    private String packId;

    @Column(nullable = false)
    private String studentEmail;

    @Column(nullable = false)
    private String studentName;

    @Column(nullable = false)
    private int score;

    @Column(nullable = false)
    private int totalQuestions;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String answersJson;

    @Column(nullable = false)
    private LocalDateTime submittedAt;

    public StudentSubmission() {
        this.id = UUID.randomUUID().toString();
        this.submittedAt = LocalDateTime.now();
    }

    public StudentSubmission(String packId, String studentEmail, String studentName, int score, int totalQuestions, String answersJson) {
        this();
        this.packId = packId;
        this.studentEmail = studentEmail;
        this.studentName = studentName;
        this.score = score;
        this.totalQuestions = totalQuestions;
        this.answersJson = answersJson;
    }

    public String getId() {
        return id;
    }

    public String getPackId() {
        return packId;
    }

    public void setPackId(String packId) {
        this.packId = packId;
    }

    public String getStudentEmail() {
        return studentEmail;
    }

    public void setStudentEmail(String studentEmail) {
        this.studentEmail = studentEmail;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public int getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(int totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public String getAnswersJson() {
        return answersJson;
    }

    public void setAnswersJson(String answersJson) {
        this.answersJson = answersJson;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }
}
