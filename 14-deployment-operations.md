1. Hosting Infrastructure (VPS Monolith)

For a low-traffic demo (10-20 visitors), managed serverless platforms are replaced with a single, highly cost-effective Virtual Private Server (VPS) such as a $6/mo DigitalOcean Droplet, Hetzner Cloud, or AWS EC2 t4g.nano.

    Docker Compose Orchestration: The entire stack runs on one machine via a single docker-compose.yml file containing:

        web: The Next.js application container.

        db: PostgreSQL container with a persistent local volume mapping.

        storage: MinIO container for S3-compatible file handling.

        proxy: Caddy or Traefik container acting as the entry point.

    Reverse Proxy & SSL: Caddy automatically provisions and renews free Let's Encrypt SSL certificates, routing traffic to either the Next.js container (for web requests) or the MinIO container (for file downloads).

2. CI/CD & Operations

    Deployment Pipeline: GitHub Actions builds the Next.js Docker image and pushes it to a free registry (like GitHub Container Registry). A secure webhook or SSH step on the VPS triggers docker compose pull && docker compose up -d to deploy the new version with zero downtime.

    Backups: A simple chron job on the VPS runs pg_dump daily and creates a tarball of the MinIO volume, storing them locally or pushing them to a free Google Drive/Dropbox tier via a CLI script.

3. Interim Deployment: Vercel + Neon (temporary, not the target architecture)

To get a shareable public URL out quickly during early development — before there's a VPS, a domain, or file-upload functionality to justify MinIO — the app is first deployed to Vercel (free tier) with a managed Neon Postgres database, instead of the VPS-with-Docker-Compose design above.

    Why: Vercel deploys straight from the Next.js source in minutes with zero server provisioning; Neon's free tier needs only a connection string, no VM to set up. Both require just a browser signup, no VPS account, payment method, or DNS to configure before something is visible.

    What's deliberately skipped for now: MinIO/S3 file storage and Auth.js are not wired into any live code path yet (no admin upload UI, no login page), so this interim deploy only needs one secret — DATABASE_URL — set in the Vercel project's environment variables. Prisma migrations run automatically on each deploy via the vercel-build script (package.json) using Vercel's build-time env injection.

    Code portability preserved: per the storage strategy above, the app uses the standard AWS S3 SDK against MinIO, so nothing about this interim choice requires rewriting file-storage code later — swapping to self-hosted MinIO on a VPS (or Cloudflare R2, if that's kept instead) is an environment-variable change, not a code change.

    Migration path back to the spec: once there's a real domain and the admin/file-upload features exist, redeploy using the VPS + docker-compose.yml + Caddy setup described in section 1, point DNS at the VPS, and treat the Neon database as disposable (re-seed or migrate its data into the VPS's Postgres container). This section should be removed once that migration happens.