def some_scoring_service(cv_content, job_reqs):
    # turn into some llm service in another folder and file
    return {
        "overall_score": 75,
        "matched_requirements": ["Python", "FastAPI"],
        "gaps": ["TypeScript depth", "No fintech experience"],
        "rationale": "Strong backend match, some gaps in frontend depth.",
        "screening_questions": ["Can you walk me through a time you worked with ambiguous requirements?"]
    }
