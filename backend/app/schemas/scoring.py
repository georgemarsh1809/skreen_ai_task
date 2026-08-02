from pydantic import BaseModel, ConfigDict, Field

class ScoreRequest(BaseModel):
    job_id: int
    candidate_id: int

class ScoreResponse(BaseModel):
    job_id: int
    candidate_id: int
    overall_score: int = Field(ge=0, le=100)
    matched_requirements: list[str]
    gaps: list[str]
    rationale: str
    screening_questions: list[str]

    model_config = ConfigDict(from_attributes=True)