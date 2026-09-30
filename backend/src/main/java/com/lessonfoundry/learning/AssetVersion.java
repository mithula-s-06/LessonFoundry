package com.lessonfoundry.learning;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "asset_versions")
public class AssetVersion {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String assetId;

    private int versionNumber;

    @Lob
    @Column(columnDefinition = "LONGTEXT", nullable = false)
    private String contentJson;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AssetStatus status;

    private String revisionReason;

    private String updatedBy;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public AssetVersion() {}

    public AssetVersion(String assetId, int versionNumber, String contentJson, AssetStatus status, String revisionReason, String updatedBy) {
        this.assetId = assetId;
        this.versionNumber = versionNumber;
        this.contentJson = contentJson;
        this.status = status;
        this.revisionReason = revisionReason;
        this.updatedBy = updatedBy;
        this.createdAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getAssetId() { return assetId; }
    public void setAssetId(String assetId) { this.assetId = assetId; }

    public int getVersionNumber() { return versionNumber; }
    public void setVersionNumber(int versionNumber) { this.versionNumber = versionNumber; }

    public String getContentJson() { return contentJson; }
    public void setContentJson(String contentJson) { this.contentJson = contentJson; }

    public AssetStatus getStatus() { return status; }
    public void setStatus(AssetStatus status) { this.status = status; }

    public String getRevisionReason() { return revisionReason; }
    public void setRevisionReason(String revisionReason) { this.revisionReason = revisionReason; }

    public String getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
