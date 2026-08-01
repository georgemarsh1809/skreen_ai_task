from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.db import Job
from app.schemas.jobs import CreateJobRequest, JobResponse

router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.post("/")
def create_job(req: CreateJobRequest, db: Session = Depends(get_db)):
    job = Job(title=req.title, requirements=req.requirements)

    db.add(job)
    db.commit()
    db.refresh(job)

    return JobResponse.model_validate(job)


@router.get("/", response_model=list[JobResponse])
def get_jobs(db: Session = Depends(get_db)):
    return db.query(Job).all()


@router.get("/{job_id}")
def get_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return JobResponse.model_validate(job)