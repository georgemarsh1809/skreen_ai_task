from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.db import Score, Job, Candidate
from app.services.scoring import score_candidate, ScoringError
from app.schemas.scoring import ScoreRequest, ScoreResponse


router = APIRouter(prefix="/scores", tags=["scores"])


@router.post('/')
async def create_score(req: ScoreRequest, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == req.job_id).first()
    if not job:
            raise HTTPException(status_code=404, detail=f"Job not found")
    
    candidate = db.query(Candidate).filter(Candidate.id == req.candidate_id).first()
    if not candidate:
                raise HTTPException(status_code=404, detail=f"Candidate not found")
        
    candidate_cv_content = candidate.cv_content

    try:
        result = await score_candidate(job_reqs=job.requirements, cv_content=candidate_cv_content)
    except ScoringError as e:
          raise HTTPException(status_code=502, detail=str(e))

          
    score = Score(
        job_id=req.job_id,
        candidate_id=req.candidate_id,
        overall_score=result.overall_score,
        matched_requirements=result.matched_requirements,
        gaps=result.gaps,
        rationale=result.rationale,
        screening_questions=result.screening_questions
    )

    db.add(score)
    db.commit()
    db.refresh(score)

    return ScoreResponse.model_validate(score)


@router.get('/job/{job_id}', response_model=list[ScoreResponse])
def get_scores_for_job(job_id: int, db: Session = Depends(get_db)):
    scores = db.query(Score).filter(Score.job_id == job_id).order_by(Score.overall_score.desc()).all()
    return scores 


@router.get('/{score_id}', response_model=ScoreResponse)
def get_single_score(score_id: int, db: Session = Depends(get_db)):
    score = db.query(Score).filter(Score.id == score_id).first()
    if not score:
        raise HTTPException(status_code=404, detail="Score not found")
    return score 