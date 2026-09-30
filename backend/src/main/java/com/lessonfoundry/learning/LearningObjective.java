package com.lessonfoundry.learning;

import jakarta.persistence.*;

@Entity
@Table(name = "learning_objectives")
public class LearningObjective {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String packId;

    private String objectiveCode; // e.g. OBJ-1

    @Column(nullable = false, length = 1000)
    private String description;

    private int sortOrder = 0;

    public LearningObjective() {}

    public LearningObjective(String packId, String objectiveCode, String description, int sortOrder) {
        this.packId = packId;
        this.objectiveCode = objectiveCode;
        this.description = description;
        this.sortOrder = sortOrder;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPackId() { return packId; }
    public void setPackId(String packId) { this.packId = packId; }

    public String getObjectiveCode() { return objectiveCode; }
    public void setObjectiveCode(String objectiveCode) { this.objectiveCode = objectiveCode; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public int getSortOrder() { return sortOrder; }
    public void setSortOrder(int sortOrder) { this.sortOrder = sortOrder; }
}
