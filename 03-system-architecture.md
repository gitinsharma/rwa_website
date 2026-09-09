
## 1. Application Paradigm: Next.js App Router

The Sector 43 RWA Portal utilizes the Next.js App Router paradigm. The architecture enforces a strict modular monolith, cleanly separating backend domain logic from frontend display while housing both in a single repository.

## 2. Server & Client Component Boundaries

The core architectural rule is to default to Server Components for performance and security, pushing Client Components strictly to the interactive leaves of the application tree.

### Server Components (The Default)

* **Role:** Handle data fetching, database queries via Prisma, and static UI composition.
* **Execution:** Run exclusively on the server, ensuring database credentials and API keys are never exposed.
* **Locations:** Route layouts, page entries (`page.tsx`), and data-heavy read components (e.g., `NoticeList`, `MeetingArchive`).

### Client Components (`'use client'`)

* **Role:** Manage browser-only APIs, interactivity, local state (`useState`), and event listeners (`onClick`).
* **Execution:** Hydrated on the client after the initial server render.
* **Locations:** Forms (`NoticeEditor`, `DocumentUploader`), interactive filters (e.g., category dropdowns), and UI toggles (e.g., mobile navigation menu).

## 3. Data Flow & Server Actions

Instead of building traditional REST API endpoints, the application leverages Next.js Server Actions for data mutations.

* **Reads:** Server Components query PostgreSQL directly using Prisma.
* **Writes/Mutations:** Client-side forms invoke Server Actions (asynchronous server functions).
* **Revalidation:** Upon successful mutation (e.g., publishing a notice), the Server Action calls `revalidatePath('/notices')` to clear the cache and instantly update the UI.

## 4. File Storage Architecture (S3 + Postgres)

PDFs and images are never stored as binary blobs in the database.

* **S3-Compatible Storage:** Receives the physical file upload directly from the admin client (via presigned URLs) or through a Server Action proxy.
* **PostgreSQL:** Stores the document metadata (title, date, category) alongside the S3 `storage_key` or URL.

## 5. Security & Authentication Boundaries

* **Public Zones:** All components in `app/(public)` are statically generated or cached where possible, requiring zero authentication context.
* **Protected Zones:** The `app/(adminrwa)` segment utilizes Next.js middleware and layout-level session checks via Auth.js to strictly reject unauthorized access before any protected rendering begins.