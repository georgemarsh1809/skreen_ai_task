from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.db import Candidate
from app.schemas.candidates import CreateCandidateRequest, CandidateResponse

router = APIRouter(prefix="/candidates", tags=["candidates"])


@router.post('/')
def create_candidate(req: CreateCandidateRequest, db: Session = Depends(get_db)):
    candidate = Candidate(name=req.name, cv_content=req.cv_content)

    db.add(candidate)
    db.commit()
    db.refresh(candidate)

    return CandidateResponse.model_validate(candidate)


@router.get('/', response_model=list[CandidateResponse])
def get_candidates(db: Session = Depends(get_db)):
    return db.query(Candidate).all()


    