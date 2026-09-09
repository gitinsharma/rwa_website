1. Framework-Level Defenses

Relying heavily on standard framework protections keeps the application secure without requiring complex, manual security architecture overhead.

    SQL Injection: All database queries are executed through Prisma ORM, which automatically parameterizes queries and sanitizes inputs.

    XSS Protection: React/Next.js automatically escapes string variables in the UI. User-submitted rich text from the Admin UI is sanitized before rendering.

    CSRF: Auth.js handles Cross-Site Request Forgery protections automatically via SameSite cookies and CSRF tokens for administrative mutations.

2. API & Route Security

    Data Exposure: Server Actions are explicitly built to only return the specific fields requested by the UI, preventing sensitive backend data (like admin IDs or unpublished drafts) from leaking into the browser's network tab.

    Rate Limiting: Basic rate limiting is enforced at the hosting/CDN edge (e.g., Vercel Edge Network) to mitigate basic DDoS attempts against the public read routes.