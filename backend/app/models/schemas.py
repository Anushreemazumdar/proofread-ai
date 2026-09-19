from typing import List, Optional, Literal
from pydantic import BaseModel, Field


class DocumentMetadata(BaseModel):
    filename: str
    pages: int
    file_size_bytes: Optional[int] = None
    upload_date: Optional[str] = None


class AnalysisSummary(BaseModel):
    importantFacts: int
    thingsToVerify: int
    conflicts: int
    actions: int


class FactItem(BaseModel):
    title: str
    value: str
    source: str
    evidence: str
    confidence: Literal["HIGH", "MEDIUM", "LOW"]


class RequirementItem(BaseModel):
    title: str
    description: str
    source: str
    confidence: Literal["HIGH", "MEDIUM", "LOW"]


class ThingToVerifyItem(BaseModel):
    issue: str
    reason: str
    priority: Literal["HIGH", "MEDIUM", "LOW"]


class ActionItem(BaseModel):
    priority: Literal["HIGH", "MEDIUM", "LOW"]
    text: str
    completed: bool = False


class ConflictSide(BaseModel):
    value: str
    source: str


class ConflictItem(BaseModel):
    topic: str
    documentA: ConflictSide
    documentB: ConflictSide
    severity: Literal["HIGH", "MEDIUM", "LOW"]
    whyItMatters: Optional[str] = None
    recommendation: str


class EvidenceItem(BaseModel):
    claim: str
    evidence: str
    source: str
    confidence: Literal["HIGH", "MEDIUM", "LOW"]


class AnalysisResponse(BaseModel):
    id: str
    document: DocumentMetadata
    summary: AnalysisSummary
    facts: List[FactItem]
    requirements: List[RequirementItem] = Field(default_factory=list)
    thingsToVerify: List[ThingToVerifyItem] = Field(default_factory=list)
    actions: List[ActionItem] = Field(default_factory=list)
    conflicts: List[ConflictItem] = Field(default_factory=list)
    evidence: List[EvidenceItem] = Field(default_factory=list)
    isMock: bool = False
    analysisMode: str = "Bedrock AI Analysis"


class DocumentComparisonResponse(BaseModel):
    id: str
    documentA: DocumentMetadata
    documentB: DocumentMetadata
    conflicts: List[ConflictItem]
    summary: str
    isMock: bool = False
    analysisMode: str = "Bedrock AI Comparison"


class DocumentListItem(BaseModel):
    id: str
    filename: str
    dateAnalyzed: str
    documentType: str
    factsCount: int
    conflictsCount: int
    status: str
