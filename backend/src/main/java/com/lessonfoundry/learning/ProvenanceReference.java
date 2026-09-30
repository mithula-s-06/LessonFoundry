package com.lessonfoundry.learning;

import jakarta.persistence.*;

@Entity
@Table(name = "provenance_references")
public class ProvenanceReference {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String assetId;

    @Column(nullable = false, length = 1000)
    private String statement;

    private String sourceTitle;

    private int sourceVersion = 1;

    private int page = 1;

    private String chunkId;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String matchedText;

    public ProvenanceReference() {}

    public ProvenanceReference(String assetId, String statement, String sourceTitle, int sourceVersion, int page, String chunkId, String matchedText) {
        this.assetId = assetId;
        this.statement = statement;
        this.sourceTitle = sourceTitle;
        this.sourceVersion = sourceVersion;
        this.page = page;
        this.chunkId = chunkId;
        this.matchedText = matchedText;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getAssetId() { return assetId; }
    public void setAssetId(String assetId) { this.assetId = assetId; }

    public String getStatement() { return statement; }
    public void setStatement(String statement) { this.statement = statement; }

    public String getSourceTitle() { return sourceTitle; }
    public void setSourceTitle(String sourceTitle) { this.sourceTitle = sourceTitle; }

    public int getSourceVersion() { return sourceVersion; }
    public void setSourceVersion(int sourceVersion) { this.sourceVersion = sourceVersion; }

    public int getPage() { return page; }
    public void setPage(int page) { this.page = page; }

    public String getChunkId() { return chunkId; }
    public void setChunkId(String chunkId) { this.chunkId = chunkId; }

    public String getMatchedText() { return matchedText; }
    public void setMatchedText(String matchedText) { this.matchedText = matchedText; }
}
