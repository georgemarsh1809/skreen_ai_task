from pydantic import BaseModel, ConfigDict
from datetime import datetime

class CreateJobRequest(BaseModel):
    title: str
    requirements: str

class JobResponse(BaseModel):
    id: int
    title: str
    requirements: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)