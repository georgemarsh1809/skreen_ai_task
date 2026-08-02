import { useState } from 'react';
import type { Candidate, Score } from '../types';

interface Props {
    candidate: Candidate;
    score: Score | null;
    isScoring: boolean;
    onScore: () => void;
}

function scoreColor(score: number): string {
    if (score >= 70) return 'var(--green)';
    if (score >= 30) return 'var(--orange)';
    return 'var(--red)';
}

function ScoreBadge({ score }: { score: number }) {
    const color = scoreColor(score);
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const progress = (score / 100) * circumference;

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width={52} height={52} style={{ transform: 'rotate(-90deg)' }}>
                <circle
                    cx={26}
                    cy={26}
                    r={radius}
                    fill="none"
                    stroke="var(--border)"
                    strokeWidth={4}
                />
                <circle
                    cx={26}
                    cy={26}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={4}
                    strokeDasharray={`${progress} ${circumference}`}
                    strokeLinecap="round"
                />
            </svg>
            <span
                style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color,
                    fontVariantNumeric: 'tabular-nums',
                }}
            >
                {score}
            </span>
        </div>
    );
}

export default function CandidateCard({
    candidate,
    score,
    isScoring,
    onScore,
}: Props) {
    const [open, setOpen] = useState(false);

    return (
        <div
            style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                overflow: 'hidden',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 20px',
                    cursor: 'pointer',
                }}
                onClick={() => setOpen((o) => !o)}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span
                        style={{
                            transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s',
                            color: 'var(--muted)',
                            fontSize: 12,
                        }}
                    >
                        ▶
                    </span>
                    <span style={{ fontWeight: 500, fontSize: 15 }}>
                        {candidate.name}
                    </span>
                </div>

                <div
                    style={{ display: 'flex', alignItems: 'center', gap: 16 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {score ? (
                        <ScoreBadge score={score.overall_score} />
                    ) : (
                        <button
                            onClick={onScore}
                            disabled={isScoring}
                            style={{
                                padding: '6px 14px',
                                background: isScoring
                                    ? 'var(--border)'
                                    : 'var(--accent)',
                                color: 'var(--text)',
                                border: 'none',
                                borderRadius: 6,
                                fontSize: 12,
                                fontWeight: 500,
                                cursor: isScoring ? 'not-allowed' : 'pointer',
                                opacity: isScoring ? 0.7 : 1,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                            }}
                        >
                            {isScoring && <span className="spinner" />}
                            {isScoring ? 'Scoring...' : 'Run Scoring'}
                        </button>
                    )}
                </div>
            </div>

            {open && (
                <div
                    style={{
                        borderTop: '1px solid var(--border)',
                        padding: '20px 24px',
                    }}
                >
                    <div style={{ marginBottom: 20 }}>
                        <div
                            style={{
                                fontSize: 11,
                                fontWeight: 600,
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                                color: 'var(--muted)',
                                marginBottom: 8,
                            }}
                        >
                            CV
                        </div>
                        <p
                            style={{
                                fontSize: 13,
                                color: 'var(--muted)',
                                whiteSpace: 'pre-line',
                                lineHeight: 1.7,
                            }}
                        >
                            {candidate.cv_content}
                        </p>
                    </div>

                    {score && (
                        <div
                            style={{
                                borderTop: '1px solid var(--border)',
                                paddingTop: 20,
                            }}
                        >
                            <div style={{ marginBottom: 16 }}>
                                <div
                                    style={{
                                        fontSize: 11,
                                        fontWeight: 600,
                                        letterSpacing: '0.08em',
                                        textTransform: 'uppercase',
                                        color: 'var(--muted)',
                                        marginBottom: 8,
                                    }}
                                >
                                    Rationale
                                </div>
                                <p style={{ fontSize: 13, lineHeight: 1.7 }}>
                                    {score.rationale}
                                </p>
                            </div>

                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: 20,
                                    marginBottom: 16,
                                }}
                            >
                                <div>
                                    <div
                                        style={{
                                            fontSize: 11,
                                            fontWeight: 600,
                                            letterSpacing: '0.08em',
                                            textTransform: 'uppercase',
                                            color: 'var(--green)',
                                            marginBottom: 8,
                                        }}
                                    >
                                        Matched
                                    </div>
                                    <ul
                                        style={{
                                            listStyle: 'none',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 6,
                                        }}
                                    >
                                        {score.matched_requirements.map(
                                            (req, i) => (
                                                <li
                                                    key={i}
                                                    style={{
                                                        fontSize: 12,
                                                        color: 'var(--text)',
                                                        lineHeight: 1.6,
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            color: 'var(--green)',
                                                            marginRight: 8,
                                                        }}
                                                    >
                                                        ✓
                                                    </span>
                                                    {req}
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </div>

                                <div>
                                    <div
                                        style={{
                                            fontSize: 11,
                                            fontWeight: 600,
                                            letterSpacing: '0.08em',
                                            textTransform: 'uppercase',
                                            color: 'var(--red)',
                                            marginBottom: 8,
                                        }}
                                    >
                                        Gaps
                                    </div>
                                    <ul
                                        style={{
                                            listStyle: 'none',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 6,
                                        }}
                                    >
                                        {score.gaps.map((gap, i) => (
                                            <li
                                                key={i}
                                                style={{
                                                    fontSize: 12,
                                                    color: 'var(--text)',
                                                    lineHeight: 1.6,
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        color: 'var(--red)',
                                                        marginRight: 8,
                                                    }}
                                                >
                                                    ✗
                                                </span>
                                                {gap}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div>
                                <div
                                    style={{
                                        fontSize: 11,
                                        fontWeight: 600,
                                        letterSpacing: '0.08em',
                                        textTransform: 'uppercase',
                                        color: 'var(--muted)',
                                        marginBottom: 8,
                                    }}
                                >
                                    Screening Questions
                                </div>
                                <ol
                                    style={{
                                        paddingLeft: 16,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 8,
                                    }}
                                >
                                    {score.screening_questions.map((q, i) => (
                                        <li
                                            key={i}
                                            style={{
                                                fontSize: 13,
                                                lineHeight: 1.7,
                                            }}
                                        >
                                            {q}
                                        </li>
                                    ))}
                                </ol>
                            </div>

                            {score && (
                                <div
                                    style={{
                                        marginTop: 20,
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                    }}
                                >
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onScore();
                                        }}
                                        disabled={isScoring}
                                        style={{
                                            padding: '6px 14px',
                                            background: 'transparent',
                                            color: isScoring
                                                ? 'var(--muted)'
                                                : 'var(--muted)',
                                            border: '1px solid var(--border)',
                                            borderRadius: 6,
                                            fontSize: 12,
                                            cursor: isScoring
                                                ? 'not-allowed'
                                                : 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 6,
                                            opacity: isScoring ? 0.7 : 1,
                                        }}
                                    >
                                        {isScoring && (
                                            <span
                                                className="spinner"
                                                style={{ borderTopColor: 'var(--muted)' }}
                                            />
                                        )}
                                        {isScoring
                                            ? 'Scoring...'
                                            : 'Re-run Scoring'}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {!score && (
                        <div
                            style={{
                                borderTop: '1px solid var(--border)',
                                paddingTop: 20,
                                display: 'flex',
                                justifyContent: 'flex-end',
                            }}
                        >
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onScore();
                                }}
                                disabled={isScoring}
                                style={{
                                    padding: '6px 14px',
                                    background: isScoring
                                        ? 'var(--border)'
                                        : 'var(--accent)',
                                    color: 'var(--text)',
                                    border: 'none',
                                    borderRadius: 6,
                                    fontSize: 12,
                                    fontWeight: 500,
                                    cursor: isScoring
                                        ? 'not-allowed'
                                        : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    opacity: isScoring ? 0.7 : 1,
                                }}
                            >
                                {isScoring && <span className="spinner" />}
                                {isScoring ? 'Scoring...' : 'Run Scoring'}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
