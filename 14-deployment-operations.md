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