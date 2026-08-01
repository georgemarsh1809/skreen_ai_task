data model:

jobs

- id, title, requirements (text), created_at

candidates

- id, name, cv_content (text), created_at

scores

- id, job_id (fk), candidate_id (fk), overall_score (int), matched_requirements
  (json), gaps (json), rationale (text), screening_questions (json), created_at
