# Sector 43 RWA

Public information and document archive for the Sector 43 Residents Welfare Association (Noida), built with Next.js (App Router), TypeScript, PostgreSQL, and MinIO.

## Important

This is a Node/Next.js project. The canonical dependency lockfile is `package-lock.json`; `requirements.txt` (if present) is a human-readable exact-version technology manifest.

## Getting started (local development)

```bash
cp .env.example .env          # fill in secrets
docker compose up -d db storage   # start Postgres + MinIO
npx prisma migrate dev
npm run dev
```

Or run the full stack (app included) in Docker:

```bash
docker compose up -d --build
```

## Next step

Implement the specifications under the repo root (`01-*.md` through `14-*.md`), starting from `project.md`, one at a time.
