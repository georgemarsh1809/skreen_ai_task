import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Skreen AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://skreenai.netlify.app/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.routes.jobs import router as jobs_router
from app.routes.candidates import router as candidates_router
from app.routes.scores import router as scores_router
app.include_router(jobs_router)
app.include_router(candidates_router)
app.include_router(scores_router)

@app.get("/health")
def health():
    return {"status": "ok"}

