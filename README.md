# Skreen AI — Candidate Screener

A full-stack app that scores candidates against a job spec using an LLM, and
proposes follow-up screening questions based on identified gaps.

Built with FastAPI, React/TypeScript, PostgreSQL, and the Anthropic API.

## Live URLs

- Frontend: https://skreenai.netlify.app
- Backend: https://skreen-ai-backend.fly.dev/health

## Stack

- **Backend:** Python, FastAPI, SQLAlchemy, Alembic, Pydantic, Anthropic API
- **Frontend:** React, TypeScript, Vite
- **Database:** PostgreSQL (Neon in production, local Postgres for dev)
- **Infrastructure:** Fly.io (backend), Netlify (frontend)

## Running locally

### Prerequisites

- Python 3.11+
- Node.js 18+
- pnpm
- uv
- A local PostgreSQL instance
- An Anthropic API key

### Setup

**1. Clone the repo**

```bash
git clone https://github.com/georgemarsh1809/skreen_ai_task.git
cd skreen_ai_task
```

**2. Backend**

```bash
cd backend
uv venv
source .venv/bin/activate
uv sync
```

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

Required environment variables:

```
DATABASE_URL=postgresql://user:password@host:5432/dbname
ANTHROPIC_API_KEY=your-anthropic-api-key
```

Run migrations and seed the database:

```bash
alembic upgrade head
python app/seed.py
```

**3. Frontend**

```bash
cd frontend
pnpm install
```

**4. Start both servers**

From the project root:

```bash
./dev.sh
```

- Backend: http://localhost:8000
- Frontend: http://localhost:5173

The seed script pre-loads the fixed test data (one job, three candidates) on
first run. If data already exists it skips silently.

## Running against the hosted database

If you'd prefer not to set up local Postgres, use the Neon connection string
I've included in the submission email as your `DATABASE_URL`. The hosted
database is already migrated and seeded — skip the migration and seed steps.

## Running tests

```bash
cd backend
source .venv/bin/activate
pytest -v
```

## Architecture notes

**Structured LLM output:** The scoring service uses Anthropic tool use with a
forced tool choice to guarantee structured output. The model cannot return free
text — it must populate the tool's input schema. The response is then validated
with a Pydantic model before being persisted.

**Error handling:** The service layer raises a custom `ScoringError` for API
failures, unexpected response shapes, and validation errors. The route layer
catches this and returns a clean 502 rather than an unhandled 500.

**Async scoring:** The scoring endpoint is `async def` using `AsyncAnthropic`.
The Anthropic call is I/O bound and can take 1-2 seconds — making it async means
the event loop can handle other requests during the wait. SQLAlchemy remains
synchronous; the natural next step would be migrating to `AsyncSession` with
`asyncpg`.

**Screening question design:** Questions are generated in the same LLM call as
scoring, using the identified gaps as input. The prompt instructs the model to
always return at least one question regardless of match strength — for strong
candidates, questions target areas where CV evidence is thin rather than
confirmed gaps.

**One candidate per CV:** Candidates are global rather than job-scoped. Adding
the same candidate to multiple jobs requires a new row. This is a known
simplification documented here rather than papered over.

## Known limitations

- No PDF upload or parsing. CV content is plain text. PyMuPDF or pdfplumber
  would be the natural next step.
- The model occasionally omits `screening_questions` from the tool response
  despite it being marked as `required` in the schema. The prompt instructs
  against this but it is not fully eliminated. A retry loop in the service would
  be the robust fix.
- SQLAlchemy is synchronous. Sync DB calls inside an async route briefly block
  the event loop. Acceptable at this scale; `AsyncSession` with `asyncpg` would
  be the production fix.
- Scoring is triggered per candidate. There is no bulk scoring endpoint — this
  was a deliberate frontend decision to avoid hitting Anthropic rate limits with
  concurrent requests.
- Voice interview stretch goal not attempted due to time constraints.

## .env.example

```
DATABASE_URL=postgresql://user:password@host:5432/dbname
ANTHROPIC_API_KEY=your-anthropic-api-key
```
