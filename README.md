# Sector 43 RWA

Public information and document archive for the Sector 43 Residents Welfare Association (Noida), built with Next.js (App Router), TypeScript, PostgreSQL, and MinIO.

**Live:** https://rwa-website01.vercel.app

## Start here

- **`CLAUDE.md`** — project context, current state, working agreements, and the gotchas worth knowing before touching anything.
- **`project.md`** — pinned stack versions, architecture principles, scope.
- **`15-implementation-status.md`** — what's built vs. placeholder vs. not started, and what to pick up next.
- **`16-local-development.md`** — running it locally + troubleshooting.
- **`01`–`14-*.md`** — design specs, in reading order.

## Important

This is a Node/Next.js project. The canonical dependency lockfile is `package-lock.json`; `requirements.txt` (if present) is a human-readable exact-version technology manifest.

## Getting started (local development)

```bash
cp .env.example .env               # fill in secrets
docker compose up -d db storage    # Postgres + MinIO
npx prisma migrate dev             # apply migrations
npx prisma db seed                 # sample content
npm run dev                        # http://localhost:3000
```

You'll also need `.env.development.local` pointing `DATABASE_URL` and `MINIO_ENDPOINT` at `localhost` (the values in `.env` use Docker hostnames) — see `16-local-development.md` §1.

> **Don't** run `npm run build` or `rm -rf .next` while `npm run dev` is running — they share `.next` and corrupt it.

To run the full stack including the app container (only needed when testing the production container build itself):

```bash
docker compose up -d --build
```

## Deployment

Pushes to `main` auto-deploy to Vercel; migrations apply automatically via the `vercel-build` script. Note that seeding the database does **not** update the live site on its own — public pages are statically generated, so a redeploy is needed to re-bake them. Full runbook in `14-deployment-operations.md` §4.
