import type { Job } from '../types';

interface Props {
    jobs: Job[];
    selectedJob: Job | null;
    onSelect: (job: Job) => void;
}

export default function Sidebar({ jobs, selectedJob, onSelect }: Props) {
    return (
        <aside
            style={{
                width: 240,
                borderRight: '1px solid var(--border)',
                background: 'var(--surface)',
                overflowY: 'auto',
                flexShrink: 0,
            }}
        >
            <div
                style={{
                    padding: '20px 16px 12px',
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--muted)',
                }}
            >
                Jobs
            </div>

            {jobs.map((job) => (
                <button
                    key={job.id}
                    onClick={() => onSelect(job)}
                    style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '10px 16px',
                        background:
                            selectedJob?.id === job.id
                                ? 'var(--surface-hover)'
                                : 'transparent',
                        border: 'none',
                        borderLeft:
                            selectedJob?.id === job.id
                                ? '2px solid var(--accent)'
                                : '2px solid transparent',
                        color:
                            selectedJob?.id === job.id
                                ? 'var(--text)'
                                : 'var(--muted)',
                        cursor: 'pointer',
                        fontSize: 13,
                        fontWeight: selectedJob?.id === job.id ? 500 : 400,
                        transition: 'all 0.15s',
                    }}
                >
                    {job.title}
                </button>
            ))}
        </aside>
    );
}
