## 1. Authentication Provider Strategy

The application uses **Auth.js (formerly NextAuth.js)** to handle secure sessions. Because the RWA will have a strictly controlled, small list of administrators rather than open public registration, the system will rely on the Auth.js **Credentials Provider**.

* **Mechanism:** Email and Password combination.
* **Password Hashing:** Passwords will be hashed using `bcrypt` (or `argon2`) before being stored in the PostgreSQL database. Plaintext passwords will never touch the database.
* **Session Strategy:** JSON Web Tokens (JWT). This is strictly required when using Auth.js with Next.js Edge Middleware for route protection.

## 2. Authorization & Role Management

While V1 is simple, establishing a basic Role-Based Access Control (RBAC) model prevents accidental privilege escalation.

* `SUPERADMIN`: Can manage all content and has the authority to create, edit, or revoke other `AdminUser` accounts.
* `EDITOR`: Can create, edit, and publish Notices, Meetings, and Documents, but cannot access the user management settings.

The JWT payload will be enriched via the Auth.js `jwt()` callback to include the user's `id` and `role`. This allows Server Actions and components to verify permissions without making an extra database query.

## 3. Route Protection (Middleware)

Next.js Edge Middleware (`middleware.ts`) acts as the primary gatekeeper for the administrative zone.

* **Matcher:** The middleware will be configured to strictly intercept the `['/adminrwa/:path*']` routes.
* **Logic:** It will check for a valid Auth.js JWT cookie.
* **Redirection:** If no valid session exists, the request is instantly redirected to `/adminrwa/login`. If a logged-in user tries to access `/adminrwa/login`, they are redirected to `/adminrwa/dashboard`.
* **Advantage:** This ensures unauthenticated requests never reach the Next.js server components or trigger database calls, mitigating unauthorized data access and reducing server load.

## 4. Security Hardening

Given that managing security boundaries might fall outside typical backend operational scaling, Auth.js handles the complex threat vectors automatically:

* **HTTP-Only Cookies:** Session tokens cannot be accessed via client-side JavaScript, preventing Cross-Site Scripting (XSS) token theft.
* **CSRF Protection:** Built-in double-submit cookie patterns prevent Cross-Site Request Forgery attacks on administrative actions.
* **Brute Force Mitigation:** (V1.5) Future iterations can introduce rate limiting on the `/adminrwa/login` endpoint using a lightweight Redis cache if login attempts become aggressive.