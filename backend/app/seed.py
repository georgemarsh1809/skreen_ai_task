import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

from app.database import SessionLocal
from app.models.db import Job, Candidate

def seed():
    db = SessionLocal()

    try:
        # Skip if already seeded
        if db.query(Job).first() or db.query(Candidate).first():
            print("Database already seeded, skipping.")
            return

        job = Job(
            title="Backend Engineer — Payments Infrastructure",
            requirements="""4+ years of professional backend engineering experience, primarily in Python or Go.
                            Experience designing and operating distributed systems / microservices in production.
                            Strong relational database experience — schema design, query optimization, and data modelling, ideally with PostgreSQL.
                            Experience designing and maintaining APIs (REST or gRPC) consumed by other services or external partners.
                            Automated testing and CI/CD pipeline experience — we ship multiple times a day and rely on strong test coverage.
                            Comfortable working with cloud infrastructure (AWS preferred: ECS/EKS, RDS, S3, CloudWatch).
                            Experience with, or strong interest in, payments processing, financial systems, or handling data under strict compliance requirements (e.g. PCI-DSS).
                            Strong written and verbal communication — you'll work closely with product, compliance, and support teams who are not engineers.
                            Nice-to-have: Experience with event-driven architectures (Kafka, SQS, or similar). Experience carrying production on-call and responding to incidents. Exposure to fraud detection, reconciliation, or ledger systems."""
        )
        db.add(job)

        candidates = [
            Candidate(
                name="Priya Anand",
                cv_content="""Backend engineer with 5 years of experience building and operating production services in Python and Go.

                                Senior Backend Engineer — Ledgerly (fintech, payments), 2022–present
                                - Designed and built the core transaction-processing service (Go, PostgreSQL), handling ~2M transactions/day across microservices.
                                - Led the migration of the merchant API from a monolith to versioned REST endpoints consumed by 40+ external partners.
                                - Owned schema design and query optimization for the ledger database, cutting p99 query latency by 60%.
                                - Worked directly with the compliance team to implement data-handling changes for PCI-DSS scope reduction.
                                - Ran production on-call rotations; led incident response for two P1 payment-processing outages.

                                Backend Engineer — Fetch Logistics, 2020–2022
                                - Built internal microservices (Python/Flask) for shipment tracking, deployed on AWS ECS.
                                - Designed relational schemas in PostgreSQL for shipment and inventory data.
                                - Integrated with third-party carrier APIs (REST), handling retries and partial failures.

                                Skills: Python, Go, PostgreSQL, REST API design, AWS (ECS, RDS, S3, CloudWatch), Kafka, distributed systems, on-call/incident response."""
            ),
            Candidate(
                name="Jordan Mills",
                cv_content="""Software engineer with a background spanning backend and platform work. ~4 years experience.

                                Software Engineer — Halcyon Digital (agency), 2021–present
                                - Worked across several client projects, building backend services and internal tools using modern backend technologies.
                                - Collaborated with teams on API development for client-facing products.
                                - Involved in database work for a few projects, including some PostgreSQL and some MongoDB.
                                - Helped set up cloud infrastructure for client deployments as needed.
                                - Contributed to improving reliability of a few production systems.

                                Junior Developer — Bright Path Solutions, 2019–2021
                                - Supported a small engineering team building web applications.
                                - Worked on backend features and some frontend maintenance.
                                - Gained exposure to payment integrations for e-commerce clients.

                                Skills: JavaScript/Node.js, some Python, PostgreSQL, MongoDB, REST APIs, cloud deployment, Docker, Git."""
            ),
            Candidate(
                name="Sam Whitfield",
                cv_content="""Frontend developer focused on building polished, accessible user interfaces. 3 years experience.

                                Frontend Developer — Loop Studio (product agency), 2022–present
                                - Built and maintained React/TypeScript frontends for several client products.
                                - Implemented design systems and component libraries used across multiple projects.
                                - Worked with designers to translate Figma files into production UI.
                                - Occasionally wrote small backend endpoints (Node.js/Express) to support frontend features, mostly CRUD operations against a Firebase database.

                                Junior Frontend Developer — Meridian Retail (in-house), 2021–2022
                                - Maintained the customer-facing e-commerce site's frontend.
                                - Fixed UI bugs and implemented minor feature requests.
                                - No involvement in backend, database, or infrastructure work.

                                Skills: React, TypeScript, CSS/Tailwind, Figma-to-code, Firebase, basic Node.js/Express, Git."""
            )
        ]

        for candidate in candidates:
            db.add(candidate)

        db.commit()
        print("Seeded: 1 job, 3 candidates.")

    except Exception as e:
        db.rollback()
        print(f"Seeding failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()