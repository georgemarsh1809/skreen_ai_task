import type { Job, Candidate, Score } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${BASE_URL}${path}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });

    if (!response.ok) {
        const error = await response
            .json()
            .catch(() => ({ detail: 'Unknown error' }));
        throw new Error(error.detail ?? 'Request failed');
    }

    return response.json();
}

export const api = {
    getJobs: () => request<Job[]>('/jobs/'),
    getCandidates: () => request<Candidate[]>('/candidates/'),
    createScore: (job_id: number, candidate_id: number) =>
        request<Score>('/scores/', {
            method: 'POST',
            body: JSON.stringify({ job_id, candidate_id }),
        }),
    getScoresForJob: (job_id: number) =>
        request<Score[]>(`/scores/job/${job_id}`),
};
