from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class LearningObjective(BaseModel):
    id: str
    description: str

class SourceReference(BaseModel):
    sourceId: str
    sourceVersion: int = 1
    chunkId: str
    page: int = 1
    snippet: str = ""

class ProvenanceItem(BaseModel):
    statement: str
    sourceTitle: str
    sourceVersion: int = 1
    page: int = 1
    chunkId: str
    matchedText: str

class GeneratedAsset(BaseModel):
    assetType: str  # EXPLANATION, WORKED_EXAMPLE, QUIZ, ANSWER_KEY, EASY_PRACTICE, ADVANCED_PRACTICE, REVISION_SHEET
    title: str
    content: Any  # text string or structured list/dict
    objectivesCovered: List[str] = Field(default_factory=list)
    sourceReferences: List[SourceReference] = Field(default_factory=list)
    provenance: List[ProvenanceItem] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(default_factory=dict)

class GenerationRequest(BaseModel):
    sourceId: str
    sourceTitle: str
    sourceVersion: int = 1
    sourceText: str
    topic: str
    gradeLevel: str
    difficulty: str  # Beginner, Intermediate, Advanced
    objectives: List[LearningObjective]
    quizQuestionCount: int = 5
    easyPracticeCount: int = 3
    advancedPracticeCount: int = 3

class RegenerationRequest(BaseModel):
    sourceId: str
    sourceTitle: str
    sourceVersion: int = 1
    sourceText: str
    topic: str
    gradeLevel: str
    difficulty: str
    assetType: str
    targetId: Optional[str] = None  # e.g., "question-3"
    currentAsset: Dict[str, Any]
    revisionInstruction: str
    objectives: List[LearningObjective]
    existingAssets: Dict[str, Any] = Field(default_factory=dict)

class ValidationIssue(BaseModel):
    level: str  # ERROR, WARNING, INFO
    category: str  # SOURCE_GROUNDING, OBJECTIVE_COVERAGE, ANSWER_MATCHING, DIFFICULTY_ALIGNMENT, CONTRADICTION
    assetType: str
    message: str
    details: Optional[str] = None

class ValidationReport(BaseModel):
    overallStatus: str  # PASS, NEEDS_REVIEW
    issues: List[ValidationIssue]
    passedChecksCount: int
    warningCount: int
    errorCount: int

class ObjectiveAlignmentItem(BaseModel):
    objectiveId: str
    objectiveDescription: str
    explanationCoverage: str  # COVERED, PARTIALLY_COVERED, NOT_COVERED
    exampleCoverage: str
    quizCoverage: str
    practiceCoverage: str
    overallStatus: str  # COVERED, PARTIALLY_COVERED, NOT_COVERED
    coverageScore: float  # 0.0 to 1.0

class AlignmentReport(BaseModel):
    overallStatus: str
    items: List[ObjectiveAlignmentItem]
    averageCoverage: float

class GenerationResponse(BaseModel):
    packTitle: str
    topic: str
    gradeLevel: str
    difficulty: str
    assets: Dict[str, GeneratedAsset]
    validation: ValidationReport
    alignment: AlignmentReport
