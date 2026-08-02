import type { Job, Candidate, CandidateWithScore } from '../types';
import CandidateCard from './CandidateCard';

interface Props {
    job: Job;
    candidatesWithScores: CandidateWithScore[];
    scoringId: number | null;
    onScore: (candidate: Candidate) => void;
}

export default function JobPanel({
    job,
    candidatesWithScores,
    scoringId,
    onScore,
}: Props) {
    return (
        <div>
            <div style={{ marginBottom: 40 }}>
                <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 20 }}>
                    {job.title}
                </h1>
                <div
                    style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        borderRadius: 12,
                        padding: '24px',
                        marginBottom: 24,
                    }}
                >
                    <div
                        style={{
                            fontSize: 12,
                            fontWeight: 600,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            color: 'var(--muted)',
                            marginBottom: 16,
                        }}
                    >
                        Requirements
                    </div>
                    <div
                        style={{
                            fontSize: 13,
                            lineHeight: 1.8,
                            color: 'var(--text)',
                            whiteSpace: 'pre-line',
                        }}
                    >
                        {job.requirements
                            .split('\n')
                            .map((line, i) => {
                                const trimmed = line.trim();
                                if (!trimmed) {
                                    return (
                                        <div
                                            key={i}
                                            style={{ height: 12 }}
                                        />
                                    );
                                }
                                if (
                                    trimmed.startsWith('-') ||
                                    trimmed.startsWith('•') ||
                                    trimmed.startsWith('*')
                                ) {
                                    return (
                                        <div
                                            key={i}
                                            style={{
                                                display: 'flex',
                                                gap: 12,
                                                marginBottom: 10,
                                            }}
                                        >
                                            <span
                                                style={{
                                                    color: 'var(--accent)',
                                                    flexShrink: 0,
                                                    marginTop: 2,
                                                }}
                                            >
                                                ▸
                                            </span>
                                            <span>
                                                {trimmed
                                                    .replace(/^[-•*]\s*/, '')
                                                    .trim()}
                                            </span>
                                        </div>
                                    );
                                }
                                return (
                                    <p
                                        key={i}
                                        style={{
                                            marginBottom: 12,
                                            color: 'var(--text)',
                                        }}
                                    >
                                        {trimmed}
                                    </p>
                                );
                            })}
                    </div>
                </div>
            </div>

            <div
                style={{
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--muted)',
                    marginBottom: 16,
                }}
            >
                Candidates — {candidatesWithScores.length}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {candidatesWithScores.map(({ candidate, score }) => (
                    <CandidateCard
                        key={candidate.id}
                        candidate={candidate}
                        score={score}
                        isScoring={scoringId === candidate.id}
                        onScore={() => onScore(candidate)}
                    />
                ))}
            </div>
        </div>
    );
}
