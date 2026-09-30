package com.lessonfoundry.learning.dto;

import jakarta.validation.constraints.NotBlank;

public class ObjectiveDto {
    private String id;
    private String objectiveCode;

    @NotBlank(message = "Objective description cannot be blank")
    private String description;

    public ObjectiveDto() {}

    public ObjectiveDto(String id, String objectiveCode, String description) {
        this.id = id;
        this.objectiveCode = objectiveCode;
        this.description = description;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getObjectiveCode() { return objectiveCode; }
    public void setObjectiveCode(String objectiveCode) { this.objectiveCode = objectiveCode; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
