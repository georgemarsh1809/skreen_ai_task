import { useEffect, useState } from 'react';
import { api } from './api/client';
import type { Job, Candidate, Score, CandidateWithScore } from './types';
import Sidebar from './components/Sidebar';
import JobPanel from './components/JobPanel';
import './index.css';

export default function App() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [candidatesWithScores, setCandidatesWithScores] = useState<
        CandidateWithScore[]
    >([]);
    const [scoringId, setScoringId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        api.getJobs()
            .then(setJobs)
            .catch(() => setError('Failed to load jobs.'));
    }, []);

    useEffect(() => {
        if (!selectedJob) return;
        setCandidatesWithScores([]);
        setError(null);

        async function load() {
            try {
                const [candidates, scores] = await Promise.all([
                    api.getCandidates(),
                    api
                        .getScoresForJob(selectedJob!.id)
                        .catch(() => [] as Score[]),
                ]);

                const paired: CandidateWithScore[] = candidates.map(
                    (candidate) => ({
                        candidate,
                        score:
                            scores.find(
                                (s) => s.candidate_id === candidate.id,
                            ) ?? null,
                    }),
                );

                paired.sort(
                    (a, b) =>
                        (b.score?.overall_score ?? -1) -
                        (a.score?.overall_score ?? -1),
                );
                setCandidatesWithScores(paired);
            } catch {
                setError('Failed to load candidates.');
            }
        }

        load();
    }, [selectedJob]);

    async function runScoring(candidate: Candidate) {
        if (!selectedJob) return;
        setScoringId(candidate.id);
        setError(null);

        try {
            const score = await api.createScore(selectedJob.id, candidate.id);
            setCandidatesWithScores((prev) => {
                const updated = prev.map((cws) =>
                    cws.candidate.id === candidate.id ? { ...cws, score } : cws,
                );
                return [...updated].sort(
                    (a, b) =>
                        (b.score?.overall_score ?? -1) -
                        (a.score?.overall_score ?? -1),
                );
            });
        } catch {
            setError(`Scoring failed for ${candidate.name}.`);
        } finally {
            setScoringId(null);
        }
    }

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
            }}
        >
            <nav
                style={{
                    height: 52,
                    borderBottom: `1px solid var(--border)`,
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 24px',
                    background: 'var(--surface)',
                    flexShrink: 0,
                }}
            >
                <span
                    style={{
                        fontWeight: 600,
                        fontSize: 15,
                        color: 'var(--text)',
                    }}
                >
                    Skreen
                </span>
                <span
                    style={{
                        marginLeft: 8,
                        color: 'var(--muted)',
                        fontSize: 13,
                    }}
                >
                    Candidate Screener
                </span>
            </nav>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                <Sidebar
                    jobs={jobs}
                    selectedJob={selectedJob}
                    onSelect={setSelectedJob}
                />

                <main
                    style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}
                >
                    {error && (
                        <div
                            style={{
                                color: 'var(--red)',
                                background: '#2a1a1a',
                                border: '1px solid var(--red)',
                                borderRadius: 8,
                                padding: '10px 16px',
                                marginBottom: 24,
                                fontSize: 13,
                            }}
                        >
                            {error}
                        </div>
                    )}

                    {!selectedJob && (
                        <div
                            style={{
                                color: 'var(--muted)',
                                marginTop: 80,
                                textAlign: 'center',
                            }}
                        >
                            Select a job from the sidebar to view candidates.
                        </div>
                    )}

                    {selectedJob && (
                        <JobPanel
                            job={selectedJob}
                            candidatesWithScores={candidatesWithScores}
                            scoringId={scoringId}
                            onScore={runScoring}
                        />
                    )}
                </main>
            </div>
        </div>
    );
}
