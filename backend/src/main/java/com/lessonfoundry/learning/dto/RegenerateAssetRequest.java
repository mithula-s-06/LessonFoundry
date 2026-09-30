package com.lessonfoundry.learning.dto;

import jakarta.validation.constraints.NotBlank;

public class RegenerateAssetRequest {
    @NotBlank(message = "Revision instruction is required")
    private String revisionInstruction;

    private String targetId; // e.g. "question-3" for single question regeneration

    public RegenerateAssetRequest() {}

    public String getRevisionInstruction() { return revisionInstruction; }
    public void setRevisionInstruction(String revisionInstruction) { this.revisionInstruction = revisionInstruction; }

    public String getTargetId() { return targetId; }
    public void setTargetId(String targetId) { this.targetId = targetId; }
}
