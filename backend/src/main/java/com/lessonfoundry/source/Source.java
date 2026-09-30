package com.lessonfoundry.source;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sources")
public class Source {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private String filename;

    @Column(nullable = false)
    private String fileType; // PDF, TXT, DOCX

    private long originalSize;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String textContent;

    private int pageCount = 1;
    private int chunkCount = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SourceStatus status = SourceStatus.PROCESSING;

    @Column(nullable = false)
    private String uploadedBy; // Teacher/Admin Email

    private int version = 1;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    public Source() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getFilename() { return filename; }
    public void setFilename(String filename) { this.filename = filename; }

    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }

    public long getOriginalSize() { return originalSize; }
    public void setOriginalSize(long originalSize) { this.originalSize = originalSize; }

    public String getTextContent() { return textContent; }
    public void setTextContent(String textContent) { this.textContent = textContent; }

    public int getPageCount() { return pageCount; }
    public void setPageCount(int pageCount) { this.pageCount = pageCount; }

    public int getChunkCount() { return chunkCount; }
    public void setChunkCount(int chunkCount) { this.chunkCount = chunkCount; }

    public SourceStatus getStatus() { return status; }
    public void setStatus(SourceStatus status) { this.status = status; }

    public String getUploadedBy() { return uploadedBy; }
    public void setUploadedBy(String uploadedBy) { this.uploadedBy = uploadedBy; }

    public int getVersion() { return version; }
    public void setVersion(int version) { this.version = version; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
