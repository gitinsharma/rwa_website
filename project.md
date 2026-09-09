# Sector 43 RWA Website

## Purpose

A public information and document archive for the Sector 43 Residents Welfare Association (RWA), Noida.

The public website requires no authentication. Only the administration interface is protected.

## Initial technology stack

Exact versions as pinned in `package.json`; bump deliberately, not via floating ranges. `Next.js` is pinned to the patched `15.5.x` line (see [security note](#security-notes) below) rather than 15.5.2 as originally scoped.

- Next.js: 15.5.25
- React: 19.1.1
- React DOM: 19.1.1
- TypeScript: 5.9.2
- Tailwind CSS: 4.1.13
- Prisma: 6.16.2
- PostgreSQL: 17.x
- Zod: 4.1.5
- Auth.js (next-auth): 5.0.0-beta.32
- Node.js: 22 LTS
- npm: 10.x

### Security notes

- `next@15.5.2` (the version originally scoped) carries a known critical CVE (CVE-2025-66478); the project is pinned to `15.5.25`, the latest patched release on the 15.5.x line, instead.
- `npm audit` currently reports residual high-severity advisories in transitive **devDependencies only** — `postcss` bundled inside `next`'s build tooling, and `deepmerge-ts`/`effect` bundled inside `@prisma/config` (used by the `prisma` CLI, not `@prisma/client`). Neither package ships in the production Docker image (the `runner` stage only copies `.next/standalone`, which excludes devDependencies), and both advisories require attacker-controlled build-time input (untrusted CSS source maps / untrusted Prisma config merges) that doesn't apply to this project's build. Fixing them cleanly requires `next@16` or a `prisma` downgrade below 6.13 — both larger changes than the advisories warrant today; revisit when either line stabilizes.

## Architecture principles

1. Start as a modular monolith.
2. Keep public pages server-rendered where practical.
3. Keep admin functionality behind authentication and authorization.
4. PostgreSQL stores structured application data.
5. Object storage stores PDFs/images/attachments; database stores metadata and object keys.
6. Do not introduce microservices, Redis, Kafka, Elasticsearch/OpenSearch, Kubernetes, or a separate backend unless a measured requirement justifies them.
7. Keep domain logic separated from UI so components can evolve without coupling business rules to pages.
8. Use TypeScript throughout the application.
9. Validate external/user input at system boundaries with Zod.
10. Treat published content as an archival record; avoid destructive changes where practical.
11. Build mobile-first and make public content SEO-friendly.
12. Security must come from authentication/authorization, not obscurity of the admin URL.

## Initial public sections

- Home
- Notices
- Announcements
- Meeting Minutes
- Documents
- Authority & Government Correspondence
- RWA / Governing Body
- Important Links
- About Sector 43
- Contact
- Search
- Archive

## Initial admin capabilities

- Authentication
- Create/edit/delete/publish notices
- Create/edit/delete/publish announcements
- Create/edit/delete/publish meeting minutes
- Upload/manage documents
- Create/edit authority correspondence
- Manage important links
- Manage RWA office bearers
- Manage categories
- View audit logs

## Non-goals for V1

- Resident accounts
- Maintenance billing
- Payments
- Visitor management
- Complaint/ticket management
- Resident directory
- Chat
- Mobile app
- Complex workflow engine
- Microservices

## Expected traffic

Approximately 5,000 visitors/day. Optimize for simplicity, correctness, security, maintainability, and fast public pages rather than premature horizontal scaling.

## Project workflow

Technical specifications live at the repo root (the `docs/` layout referenced below was never adopted — files sit alongside this one). Each specification is implementation-oriented and is **kept in sync with what's actually built**: when a decision changes during implementation, the spec is edited to record the new decision and the reasoning, including things deliberately not done.

Start with `CLAUDE.md` for orientation, then:

Recommended order:

1. `01-product-and-scope.md`
2. `02-information-architecture.md`
3. `03-system-architecture.md`
4. `04-data-model.md`
5. `05-public-ui-spec.md`
6. `06-admin-ui-spec.md`
7. `07-api-and-server-actions.md`
8. `08-authentication-and-authorization.md`
9. `09-file-storage-and-document-management.md`
10. `10-search-and-archive.md`
11. `11-security.md`
12. `12-seo-performance-and-accessibility.md`
13. `13-testing.md`
14. `14-deployment-and-operations.md`

Plus two living operational documents, added once implementation was underway:

15. `15-implementation-status.md` — what is actually built vs. specced; update it whenever a feature lands
16. `16-local-development.md` — local setup and diagnosed failure modes

Claude should read `CLAUDE.md`, `project.md`, and all relevant specifications before implementing a feature.
