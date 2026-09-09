# 16 — Local Development & Troubleshooting

How to run the project locally, and the failure modes already diagnosed the
hard way. Read §3 before debugging any "the dev server is broken" symptom —
most of them have a known cause.

## 1. Recommended setup (native dev server)

Postgres and MinIO in Docker; Next.js runs **natively on the host**.

```bash
docker compose up -d db storage    # Postgres 17 + MinIO
npm run dev                        # http://localhost:3000
```

Why not run the web app in Docker too: `docker-compose.override.yml` still
supports it, but the containerised dev server proved fragile (see §3.1) and
adds a rebuild cycle whenever dependencies change. Native is faster and
simpler. Bring the `web` container up only when testing the production
container build itself.

### Environment files

| File | Purpose | Committed? |
| --- | --- | --- |
| `.env.example` | Template of every variable | ✅ yes |
| `.env` | Docker-network values (`db:5432`, `storage:9000`) | ❌ gitignored |
| `.env.development.local` | Host overrides (`localhost:5432`, `localhost:9000`) — Next.js loads this at higher priority than `.env` for `npm run dev` | ❌ gitignored |
| `.env.production.local` | Pulled from Vercel (`vercel env pull`) — contains the **real Neon connection string**. Used for seeding production | ❌ gitignored, never commit |

If `.env.development.local` is missing, `npm run dev` will try to resolve the
hostname `db`, which doesn't exist outside Docker.

### Database

```bash
npx prisma migrate dev      # create + apply a migration
npx prisma db seed          # sample notices + meeting minutes
npx prisma studio           # browse data
```

## 2. Verifying changes

```bash
npm run lint                # ESLint
npx tsc --noEmit            # type check — safe while dev server runs
npm run build               # ⚠️ only with the dev server STOPPED (see §3.1)
```

Prefer `lint` + `tsc` while iterating; they don't touch `.next`.

## 3. Known failure modes

### 3.1 `.next` corruption — `ENOENT: ... _buildManifest.js.tmp.*` / `routes-manifest.json`

**Symptom:** every route returns HTTP 500; logs fill with `ENOENT` on files
inside `.next/`. No syntax error, no useful stack trace.

**Cause:** two processes writing the same `.next` directory. `npm run dev` and
`npm run build` share it, and `rm -rf .next` while the dev server is live
deletes files out from under it. This is *the* cause — it was misdiagnosed
several times as Turbopack flakiness, a virtiofs/Colima mount problem, and a
Docker volume problem before being pinned down.

**Fix:** stop the dev server, `rm -rf .next`, restart it.

**Prevention:** never run `npm run build` or `rm -rf .next` while a dev server
is running against the same directory.

### 3.2 Prisma client is stale after a schema change

**Symptom:** `TypeError: Cannot read properties of undefined` on a field you
just added, or `The column X does not exist in the current database`.

**Cause:** a running Node process caches `@prisma/client` at import time.
Regenerating on disk does not update an already-running dev server. When using
Docker, the host and the container have *separate* `node_modules`, so both
need generating.

**Fix:** `npx prisma generate`, then **restart** the dev server.

### 3.3 Changes not appearing (Docker dev server only)

Colima's virtiofs mount doesn't reliably forward inotify events into
containers, so the file watcher misses host edits. `WATCHPACK_POLLING=true` is
already set in `docker-compose.override.yml`. Not applicable to native dev.

### 3.4 New dependency not found in the container

Compose reuses the anonymous `node_modules` volume across rebuilds, so a newly
installed package stays missing. Recreate with fresh volumes:

```bash
docker compose up -d --build -V web    # -V renews anonymous volumes
```

### 3.5 Host disk full

A full disk corrupted Colima's containerd image store mid-build, producing
`input/output error` on image layers. Free space, then `colima restart`. If
the image store stays broken, `colima delete && colima start` (re-pulls
images).

## 4. Docker / Colima notes

Docker Desktop wasn't used — its Homebrew cask install needs an interactive
sudo password. Colima works without that:

```bash
brew install docker docker-compose colima
colima start
```

`docker-compose` is installed as a CLI plugin, which needs registering in
`~/.docker/config.json`:

```json
{ "cliPluginsExtraDirs": ["/opt/homebrew/lib/docker/cli-plugins"] }
```

Useful:

```bash
docker compose ps
docker compose logs web -f
docker compose down          # stop, keep data
docker compose down -v       # stop, wipe volumes (fresh DB)
```

## 5. Machine auth setup (GitHub + Vercel)

Already configured on the owner's Mac; documented because getting here took
several failed attempts.

### Git push to GitHub

The macOS keychain credential helper caches credentials **per host**, so a
token for a different GitHub account silently wins for every `github.com`
repo. Symptom: `Permission to gitinsharma/rwa_website.git denied to <other
account>`. Fixes applied, in this repo's local config:

```bash
git config credential.https://github.com.useHttpPath true
```

This keys cached credentials by full URL path, so multiple GitHub accounts can
coexist. To clear a wrong cached entry:

```bash
printf 'protocol=https\nhost=github.com\npath=gitinsharma/rwa_website.git\n' \
  | git credential-osxkeychain erase
```

Then push and enter the username + a personal access token (classic, `repo`
scope) as the password.

Note: `git push` prompting for credentials needs a real TTY. Running it
through a non-interactive shell fails with `could not read Username ...:
Device not configured` — run it in a normal terminal.

### `gh` CLI

```bash
brew install gh
gh auth login --with-token < ~/.gh_token_gitinsharma
```

`~/.gh_token_gitinsharma` (chmod 600, outside the repo) holds the PAT. That
token has broad scopes (`admin:org`, `repo`, `workflow`, …) — broader than
this project needs, worth narrowing if it's ever reused elsewhere.

### Vercel CLI

```bash
npm install -g vercel
vercel login                 # browser flow, no token to paste
vercel link --project rwa-website01
```

Careful: bare `vercel link --yes` **creates a new project** rather than
matching the existing one — always pass `--project`.

```bash
vercel env pull .env.production.local --environment=production
```

Variables marked *Sensitive* in Vercel come back as `[SENSITIVE]` and must be
filled in by hand from the Neon dashboard.

## 6. Node version

`project.md` pins Node 22 LTS (what the Docker image uses). The dev machine
currently runs Node 26, which works fine for local development but means local
and production runtimes differ — worth remembering if a runtime-specific bug
ever appears.
