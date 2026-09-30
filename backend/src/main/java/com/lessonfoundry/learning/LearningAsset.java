package com.lessonfoundry.learning;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "learning_assets")
public class LearningAsset {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String packId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AssetType assetType;

    @Column(nullable = false)
    private String title;

    @Lob
    @Column(columnDefinition = "LONGTEXT", nullable = false)
    private String contentJson;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AssetStatus status = AssetStatus.DRAFT;

    private int currentVersion = 1;

    private String objectivesCovered; // JSON or comma-separated: OBJ-1, OBJ-2

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String provenanceJson;

    private String lastModifiedBy;

    private String revisionReason;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    public LearningAsset() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPackId() { return packId; }
    public void setPackId(String packId) { this.packId = packId; }

    public AssetType getAssetType() { return assetType; }
    public void setAssetType(AssetType assetType) { this.assetType = assetType; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContentJson() { return contentJson; }
    public void setContentJson(String contentJson) { this.contentJson = contentJson; }

    public AssetStatus getStatus() { return status; }
    public void setStatus(AssetStatus status) { this.status = status; }

    public int getCurrentVersion() { return currentVersion; }
    public void setCurrentVersion(int currentVersion) { this.currentVersion = currentVersion; }

    public String getObjectivesCovered() { return objectivesCovered; }
    public void setObjectivesCovered(String objectivesCovered) { this.objectivesCovered = objectivesCovered; }

    public String getProvenanceJson() { return provenanceJson; }
    public void setProvenanceJson(String provenanceJson) { this.provenanceJson = provenanceJson; }

    public String getLastModifiedBy() { return lastModifiedBy; }
    public void setLastModifiedBy(String lastModifiedBy) { this.lastModifiedBy = lastModifiedBy; }

    public String getRevisionReason() { return revisionReason; }
    public void setRevisionReason(String revisionReason) { this.revisionReason = revisionReason; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
