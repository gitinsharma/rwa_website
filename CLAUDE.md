# CLAUDE.md — read this first

Context for the Sector 43 RWA portal. This file is the entry point; it links
out to everything else. Keep it updated as the project moves.

## What this is

A public, read-first information portal for the **Sector 43 Residents
Welfare Association, Noida** — notices, meeting minutes, RWA documents,
authority correspondence, membership/dues transparency, and a contact
directory. No resident logins; only the (not yet built) admin area is
protected.

- **Live:** https://rwa-website01.vercel.app
- **Repo:** https://github.com/gitinsharma/rwa_website (`main` is deployed)
- **Owner:** senior backend/infra engineer — skip basic programming
  explanations; focus on Next.js App Router patterns, Docker, and production
  concerns.

## Where the context lives

| Doc | What's in it |
| --- | --- |
| `project.md` | Stack versions (pinned), architecture principles, scope, security notes |
| `01`–`14-*.md` | Design specs, numbered in reading order. **These are kept in sync with reality** — when a decision changes, the spec is edited, including the rationale |
| `15-implementation-status.md` | What's actually built vs. placeholder vs. not started, per route/component |
| `16-local-development.md` | How to run it locally + hard-won troubleshooting (read before debugging dev-server weirdness) |
| `14-deployment-operations.md` | Deploy runbook — Vercel/Neon specifics and the gotchas |

Source data dropped in by the RWA lives at the repo root / in `public/`:
`contacts_data.md`, `public/membership_payment_details.md`,
`notice_sample.md` (real notice text, English + Hindi — good source material
for seeding real notices).

## Working agreements (from the owner)

1. **Keep the `.md` files updated as we go.** Every decision, including
   tradeoffs and things deliberately *not* done, gets written into the
   relevant spec so context isn't lost between sessions. This is explicit,
   repeated guidance — treat it as a standing requirement, not a nicety.
2. **Mobile-first, always.** Nearly all residents (and admins) will use a
   phone. Design and review at mobile widths first. ~44px touch targets.
3. **Work locally, batch the deploys.** Iterate against local Postgres; only
   touch Vercel/Neon when explicitly asked to ship.
4. **Don't commit or push unless asked.** The owner reviews first.
5. Static/hardcoded data is acceptable for low-churn content (contacts,
   membership) while there's no admin auth to gate edits behind — but say so
   in the docs and note the future DB model.

## Fast start

```bash
docker compose up -d db storage   # Postgres + MinIO only
npm run dev                       # Next.js natively on the host
```
Then http://localhost:3000. **Do not** run `npm run build` or `rm -rf .next`
while `npm run dev` is running — they share `.next` and corrupt it. See
`16-local-development.md`; this cost hours before it was diagnosed.

## Current state, in one paragraph

Public site is live and demo-ready. Home (hero carousel, urgent-notice alert
strip, quick actions, recent notices), Notices (list + detail), Meetings
(year-grouped timeline with PDF download), Membership & Dues (searchable
sticky-header table), and About & Contact are **built**. Documents and
Authority are still placeholder pages. There is **no admin UI and no auth
yet** — all content is either seeded via `prisma/seed.ts` or hardcoded in
`src/lib/*.ts`, so publishing new content currently means editing code or
re-seeding, then redeploying. See `15-implementation-status.md` for detail
and `#next-steps` there for what to pick up next.

## Things that will bite you

- **Seed + redeploy is a two-step.** Public pages are statically generated at
  build time, so seeding Neon does *not* update the live site — you must
  redeploy so pages re-bake. Goes away once admin mutations call
  `revalidatePath` (per `03-system-architecture.md`).
- **Prisma client is cached per process.** After a schema change, a running
  dev server keeps the old client until restarted — `prisma generate` alone
  isn't enough. Regenerate on *both* host and container if using Docker.
- **Vercel env vars are per-environment.** `DATABASE_URL` must be ticked for
  both Production *and* Preview, or PR/branch deploys fail at
  `prisma migrate deploy`.
- **Two of the three hero images are placeholders** not cleared for real
  publication (a real-estate firm's watermarked map, a political party
  graphic). The owner approved them for the demo only. Swap via
  `HERO_IMAGES` in `src/app/(public)/page.tsx` once real Sector 43 photos
  arrive.
- **Real personal data is published deliberately** on `/about` and
  `/membership` (names, phone numbers, addresses, payment status). That's the
  requested transparency feature, not a leak — but treat changes to it with
  care, and never add payment reference/UPI numbers (explicit design choice,
  see `02-information-architecture.md` §F).
