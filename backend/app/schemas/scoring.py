from pydantic import BaseModel, ConfigDict

class ScoreRequest(BaseModel):
    job_id: int
    candidate_id: int

class ScoreResponse(BaseModel):
    job_id: int
    candidate_id: int
    overall_score: int
    matched_requirements: list[str]
    gaps: list[str]
    rationale: str
    screening_questions: list[str]

    model_config = ConfigDict(from_attributes=True)