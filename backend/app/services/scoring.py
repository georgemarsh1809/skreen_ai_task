import os
from anthropic import AsyncAnthropic, APIError
from app.schemas.scoring import ScoreResponse
from pydantic import ValidationError

client = AsyncAnthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

class ScoringError(Exception):
    """Raised when the scoring service fails to produce a valid result."""

SCORING_TOOL = {
    "name": "score_candidate",
    "description": "Score a candidate against a job description and generate follow-up screening questions based on identified gaps.",
    "input_schema": {
        "type": "object",
        "properties": {
            "overall_score": {
                "type": "integer",
                "description": "Overall match score from 0 to 100"
            },
            "matched_requirements": {
                "type": "array",
                "items": {"type": "string"},
                "description": "List of job requirements the candidate clearly meets"
            },
            "gaps": {
                "type": "array",
                "items": {"type": "string"},
                "description": "List of job requirements the candidate does not meet or where evidence is weak"
            },
            "rationale": {
                "type": "string",
                "description": "A concise explanation of the overall score referencing specific evidence from the CV"
            },
            "screening_questions": {
                "type": "array",
                "items": {"type": "string"},
                "description": "Follow-up questions for a recruiter to ask this candidate, targeting the specific gaps identified. Only generate questions where a gap is significant enough to warrant probing. Not every gap needs a question."
            }
        },
        "required": ["overall_score", "matched_requirements", "gaps", "rationale", "screening_questions"]
    }
}


async def score_candidate(cv_content: str, job_reqs: str) -> ScoreResponse:
    prompt = f"""You are an expert technical recruiter. Score the following candidate against the job requirements.

                Job Requirements:
                {job_reqs}

                Candidate CV:
                {cv_content}

                Be precise and evidence-based. Only claim a requirement is matched if there is clear evidence in the CV. Flag gaps honestly even if the candidate is otherwise strong.
                
                You must always return at least one screening question regardless of how strong or weak the match is. For strong candidates, focus questions on areas where CV evidence is thin or where depth is unclear. For weak candidates, focus on the most critical gaps."""
    try:
        response = await client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=1024,
            tools=[SCORING_TOOL],
            tool_choice={"type": "tool", "name": "score_candidate"},
            messages=[{"role": "user", "content": prompt}]
        )

        tool_input = response.content[0].input

        return ScoreResponse(
            job_id=0,
            candidate_id=0,
            overall_score=tool_input["overall_score"],
            matched_requirements=tool_input["matched_requirements"],
            gaps=tool_input["gaps"],
            rationale=tool_input["rationale"],
            screening_questions=tool_input["screening_questions"]
        )

    except APIError as e:
        raise ScoringError(f"Anthropic API error: {str(e)}")
    except (IndexError, KeyError) as e:
        raise ScoringError(f"Unexpected response shape from Anthropic: {str(e)}")
    except ValidationError as e:
        raise ScoringError(f"LLM response failed validation: {e.errors()}")  
