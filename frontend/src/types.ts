export interface Job {
    id: number;
    title: string;
    requirements: string;
    created_at: string;
}

export interface Candidate {
    id: number;
    name: string;
    cv_content: string;
    created_at: string;
}

export interface Score {
    id: number;
    job_id: number;
    candidate_id: number;
    overall_score: number;
    matched_requirements: string[];
    gaps: string[];
    rationale: string;
    screening_questions: string[];
    created_at: string;
}

export interface CandidateWithScore {
    candidate: Candidate;
    score: Score | null;
}
