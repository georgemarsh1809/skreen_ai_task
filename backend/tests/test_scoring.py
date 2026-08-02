import pytest
from unittest.mock import MagicMock, patch
from app.services.scoring import score_candidate, ScoringError

def make_mock_response(tool_input: dict):
    mock_content = MagicMock()
    mock_content.input = tool_input
    mock_response = MagicMock()
    mock_response.content = [mock_content]
    return mock_response


@patch("app.services.scoring.client")
async def test_valid_response_returns_score(mock_client):
    mock_client.messages.create.return_value = make_mock_response({
        "overall_score": 85,
        "matched_requirements": ["Python", "FastAPI"],
        "gaps": ["No Kubernetes experience"],
        "rationale": "Strong backend match with minor infrastructure gaps.",
        "screening_questions": ["Can you describe your experience with container orchestration?"]
    })

    result = await score_candidate(cv_content="Python developer with FastAPI experience.", job_reqs="Python, FastAPI, Kubernetes")

    assert result.overall_score == 85
    assert "Python" in result.matched_requirements
    assert result.screening_questions[0] == "Can you describe your experience with container orchestration?"


@patch("app.services.scoring.client")
async def test_score_out_of_range_raises_scoring_error(mock_client):
    mock_client.messages.create.return_value = make_mock_response({
        "overall_score": 150,
        "matched_requirements": ["Python"],
        "gaps": ["No FastAPI experience"],
        "rationale": "Some match.",
        "screening_questions": ["Tell me about FastAPI."]
    })

    with pytest.raises(ScoringError):
        await score_candidate(cv_content="Python developer.", job_reqs="Python, FastAPI")


@patch("app.services.scoring.client")
async def test_missing_field_raises_scoring_error(mock_client):
    mock_client.messages.create.return_value = make_mock_response({
        "overall_score": 75,
        "matched_requirements": ["Python"],
        # gaps field missing 
        "rationale": "Some match.",
        "screening_questions": ["Tell me about your experience."]
    })

    with pytest.raises(ScoringError):
        await score_candidate(cv_content="Python developer.", job_reqs="Python, FastAPI")


@patch("app.services.scoring.client")
async def test_api_error_raises_scoring_error(mock_client):
    import anthropic
    mock_client.messages.create.side_effect = anthropic.APIError(
        message="API unavailable",
        request=MagicMock(),
        body=None
    )

    with pytest.raises(ScoringError):
        await score_candidate(cv_content="Python developer.", job_reqs="Python, FastAPI")