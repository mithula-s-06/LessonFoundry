package com.lessonfoundry.learning;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "pack_discussions")
public class PackDiscussion {

    @Id
    private String id;

    @Column(nullable = false)
    private String packId;

    @Column(nullable = false)
    private String userEmail;

    @Column(nullable = false)
    private String userName;

    @Column(nullable = false)
    private String userRole; // "TEACHER" | "STUDENT"

    @Lob
    @Column(columnDefinition = "LONGTEXT", nullable = false)
    private String message;

    private String replyToId;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public PackDiscussion() {
        this.id = UUID.randomUUID().toString();
        this.createdAt = LocalDateTime.now();
    }

    public PackDiscussion(String packId, String userEmail, String userName, String userRole, String message, String replyToId) {
        this();
        this.packId = packId;
        this.userEmail = userEmail;
        this.userName = userName;
        this.userRole = userRole;
        this.message = message;
        this.replyToId = replyToId;
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

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserRole() {
        return userRole;
    }

    public void setUserRole(String userRole) {
        this.userRole = userRole;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getReplyToId() {
        return replyToId;
    }

    public void setReplyToId(String replyToId) {
        this.replyToId = replyToId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
