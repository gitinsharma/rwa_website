# 15 — Implementation Status

A snapshot of what is actually built, as opposed to what the specs describe.
Specs `01`–`14` describe the *intended* system; this file says how far along
it is. **Update this whenever a feature lands or a placeholder is replaced.**

Last updated: 10 September 2026, after the first production deploy for the
RWA-heads demo.

## 1. Public routes

| Route | Status | Data source | Notes |
| --- | --- | --- | --- |
| `/` | ✅ Built | DB (`Notice`) + static image list | Hero carousel, urgent alert strip, quick actions, 3 most recent notices |
| `/notices` | ✅ Built | DB (`Notice`) | Lists all published notices. **No category filtering yet** (`FilterPills` unbuilt) and no pagination |
| `/notices/[slug]` | ✅ Built | DB (`Notice`) | Full content + per-notice `generateMetadata`; unknown slug → 404 |
| `/meetings` | ✅ Built | DB (`MeetingMinute`) | Year-grouped timeline, meeting-type pills, PDF download via `DownloadRow` |
| `/membership` | ✅ Built | Static (`src/lib/membership.ts`) | Searchable, sticky-header table; Paid/Not Paid/Pending |
| `/about` | ✅ Built | Static (`src/lib/contacts.ts`) | Office bearers + security contacts, tap-to-call/mailto |
| `/documents` | ⛔ Placeholder | — | `PlaceholderSection`; needs `Document` model wiring + upload |
| `/authority` | ⛔ Placeholder | — | `PlaceholderSection`; needs `AuthorityLetter` wiring |
| `/search` | ❌ Not started | — | Spec'd in `10-search-archive.md` |
| `/archive` | ❌ Not started | — | Spec'd in `10-search-archive.md` |

## 2. Admin & auth — not started

**Nothing under `/adminrwa` exists yet.** `next-auth` (Auth.js v5 beta) and
`bcrypt` are installed but not wired into a single code path. No login page,
no middleware, no server actions, no CRUD screens.

This is the single biggest gap between "demo" and "usable product": today,
publishing a notice means editing `prisma/seed.ts` (or the DB directly) and
redeploying. Specs to implement: `06-admin-ui.md`, `07-api-server-actions.md`,
`08-authentication-authorization.md`.

## 3. File storage — not wired

MinIO runs in Docker and the AWS S3 SDK packages are installed, but **no code
calls them**. The one real PDF is served as a plain static file from
`public/documents/mom/`. `MeetingMinute.fileUrl` holds a URL path rather than
an S3 key — the field's contract ("S3 object key or public URL") already
covers both, so no migration is needed when real uploads land.
See `09-file-document-management.md`.

## 4. Shared components

| Component | Status |
| --- | --- |
| `Header`, `Footer` | ✅ Built (sticky header, mobile hamburger, ~44px targets) |
| `NoticeCard` | ✅ Built |
| `EmptyState` | ✅ Built |
| `AlertStrip` | ✅ Built (client; dismissal persisted per-notice in `localStorage`) |
| `HeroCarousel` | ✅ Built (auto-rotate, pause on hover/focus, respects `prefers-reduced-motion`) |
| `DownloadRow` | ✅ Built (used by `/meetings`; ready for Documents/Authority) |
| `MembershipTable` | ✅ Built (client; search + sticky header + bounded scroll) |
| `FeeStatusCell` | ✅ Built (Paid / Not Paid / Pending) |
| `PlaceholderSection` | ✅ Built (interim for unbuilt routes) |
| `FilterPills` | ❌ Not built — `/notices` has no filtering |
| `Pagination` | ❌ Not built — no list is long enough to need it yet |

## 5. Data model

Implemented in `prisma/schema.prisma`, two migrations applied
(`init`, `add_meeting_type`):

- `AdminUser`, `Role` — table exists, seeded with one SUPERADMIN, **unused**
  (no auth yet). Seed password is a throwaway (`changeme123`) and must be
  changed before auth ships.
- `Notice`, `NoticeCategory` — in use.
- `MeetingMinute`, `MeetingType` (`AGM` / `EGM` / `WORKING_COMMITTEE` /
  `GENERAL_MEETING`) — in use.
- `Document`, `DocumentType` — table exists, unused.
- `AuthorityLetter`, `LetterDirection`, `LetterStatus` — table exists, unused.
- **Membership data is not in Postgres** — static TS. Proposed future model is
  documented in `04-data-model.md` §2b.

## 6. Known issues / decisions carrying risk

1. **Annual vs one-time security charge (open).** The RWA's own notice
   (`notice_sample.md`) says ₹10,000 is an *annual* security guard charge,
   while ₹15,000 development fund is one-time. The membership model stores a
   single paid/unpaid status per fee, which cannot express *which year* was
   paid for. Today it effectively means "current cycle". **Must be revisited
   before a second year's collection.** Docs/copy corrected; model not yet.
2. **Hero images not cleared for publication.** Two of three are placeholder
   content (real-estate firm's watermarked layout map; a political party
   greeting graphic). Approved by the owner for demo use only. Replace via
   `HERO_IMAGES` in `src/app/(public)/page.tsx` when real photos arrive.
3. **Membership dataset is partial and partly placeholder.** 3 of 15 houses
   have real recorded status; the other 12 are `PENDING` (status not yet
   collected — deliberately *not* rendered as "Not Paid"). Real Sector 43 has
   ~200+ houses.
4. **No tests.** `13-testing.md` is unimplemented — no unit, integration, or
   e2e tests exist. Verification so far has been manual (HTTP checks + lint +
   build).
5. **`npm audit`: 5 high-severity advisories**, all devDependency-only
   (postcss inside `next`'s build tooling; `deepmerge-ts`/`effect` inside
   `@prisma/config`). Not in the production bundle; no clean fix exists
   without a `next@16` major or a `prisma` downgrade. See `project.md`.
6. **`package.json#prisma` seed config is deprecated** (removed in Prisma 7);
   migrate to `prisma.config.ts` before any Prisma major bump.
7. **Registration fee amount is unknown.** Development (₹15,000) and security
   (₹10,000) are confirmed; the registration fee amount has never been stated
   and is not encoded anywhere.

## 7. Next steps

Roughly in the order that adds most value:

1. **Admin auth + notice CRUD** (`06`/`07`/`08`) — removes the
   edit-code-and-redeploy bottleneck and makes `revalidatePath` work, which
   also kills the seed-then-redeploy two-step.
2. **Replace hero placeholders** with real Sector 43 photos.
3. **Documents + Authority pages** — the models and `DownloadRow` already
   exist; needs data entry and file upload.
4. **Fix the annual-fee model** before the next collection cycle (issue 1).
5. **Seed real notices** — `notice_sample.md` has three real, well-written
   notices (English + Hindi) ready to use.
6. Search/archive (`10`), then tests (`13`).
