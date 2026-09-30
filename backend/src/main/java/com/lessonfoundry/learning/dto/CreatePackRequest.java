package com.lessonfoundry.learning.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public class CreatePackRequest {
    @NotBlank(message = "Source ID is required")
    private String sourceId;

    @NotBlank(message = "Topic is required")
    private String topic;

    @NotBlank(message = "Grade level is required")
    private String gradeLevel;

    private String difficulty = "Beginner"; // Beginner, Intermediate, Advanced

    @NotEmpty(message = "At least one learning objective is required")
    private List<ObjectiveDto> objectives;

    private int quizQuestionCount = 5;
    private int easyPracticeCount = 3;
    private int advancedPracticeCount = 3;

    public CreatePackRequest() {}

    public String getSourceId() { return sourceId; }
    public void setSourceId(String sourceId) { this.sourceId = sourceId; }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public String getGradeLevel() { return gradeLevel; }
    public void setGradeLevel(String gradeLevel) { this.gradeLevel = gradeLevel; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public List<ObjectiveDto> getObjectives() { return objectives; }
    public void setObjectives(List<ObjectiveDto> objectives) { this.objectives = objectives; }

    public int getQuizQuestionCount() { return quizQuestionCount; }
    public void setQuizQuestionCount(int quizQuestionCount) { this.quizQuestionCount = quizQuestionCount; }

    public int getEasyPracticeCount() { return easyPracticeCount; }
    public void setEasyPracticeCount(int easyPracticeCount) { this.easyPracticeCount = easyPracticeCount; }

    public int getAdvancedPracticeCount() { return advancedPracticeCount; }
    public void setAdvancedPracticeCount(int advancedPracticeCount) { this.advancedPracticeCount = advancedPracticeCount; }
}
