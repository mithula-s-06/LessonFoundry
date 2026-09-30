package com.lessonfoundry.source;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "source_versions")
public class SourceVersion {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String sourceId;

    private int versionNumber;

    private String filename;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String textContent;

    private String modifiedBy;

    private LocalDateTime createdAt = LocalDateTime.now();

    public SourceVersion() {}

    public SourceVersion(String sourceId, int versionNumber, String filename, String textContent, String modifiedBy) {
        this.sourceId = sourceId;
        this.versionNumber = versionNumber;
        this.filename = filename;
        this.textContent = textContent;
        this.modifiedBy = modifiedBy;
        this.createdAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getSourceId() { return sourceId; }
    public void setSourceId(String sourceId) { this.sourceId = sourceId; }

    public int getVersionNumber() { return versionNumber; }
    public void setVersionNumber(int versionNumber) { this.versionNumber = versionNumber; }

    public String getFilename() { return filename; }
    public void setFilename(String filename) { this.filename = filename; }

    public String getTextContent() { return textContent; }
    public void setTextContent(String textContent) { this.textContent = textContent; }

    public String getModifiedBy() { return modifiedBy; }
    public void setModifiedBy(String modifiedBy) { this.modifiedBy = modifiedBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
