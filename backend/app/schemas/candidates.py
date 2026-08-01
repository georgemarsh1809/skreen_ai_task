from pydantic import BaseModel, ConfigDict
from datetime import datetime

class CreateCandidateRequest(BaseModel):
    name: str
    cv_content: str

class CandidateResponse(BaseModel):
    id: int
    name: str
    cv_content: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)