
## 1. Site Map & Route Structure

The application is divided into two strict routing zones: the Public UI (accessible to all residents) and the Admin UI (protected behind authentication).

### Public Routes

* `/` (Home)
* `/notices` (Paginated list of all announcements)
* `/notices/[slug]` (Individual notice view)


* `/meetings` (MOM archive)
* `/documents` (General RWA documents, bylaws)
* `/authority` (Official correspondence)
* `/membership` (Per-house membership fee transparency — registration, development fund, security charges — and total funds collected)
* `/about` (RWA directory & contact info)

### Admin Routes (Protected)

* `/adminrwa/login`
* `/adminrwa/dashboard`
* `/adminrwa/notices` (List, edit, delete)
* `/adminrwa/notices/new`


* `/adminrwa/meetings`
* `/adminrwa/meetings/new`


* `/adminrwa/documents`
* `/adminrwa/authority`

---

## 2. Global Layouts

### Public Layout (`app/(public)/layout.tsx`)

* **Header:** Sticky navigation bar containing the RWA Logo, primary navigation links (`Notices`, `Meetings`, `Documents`, `Authority`, `Membership`, `About`), and a mobile hamburger menu.
* **Footer:** Essential links, copyright, official RWA email, and a disclaimer that the site is for informational purposes.

### Admin Layout (`app/(adminrwa)/layout.tsx`)

* **Sidebar Navigation:** Persistent left-hand menu with icons for each content type (`Dashboard`, `Manage Notices`, `Manage Meetings`, `Manage Documents`, `Manage Correspondence`, `Settings`).
* **Top Bar:** Current user profile, "Logout" button, and a quick "New Post" action button.
* **Main Content Area:** The working space for data tables and forms.

---

## 3. Page-Level Component Architecture

### A. Home Page (`/`)

* **Hero Section:** Welcoming banner identifying Sector 43, with a brief mission statement.
* **Alert Banner (Optional):** Conditional component that only renders if an "Urgent" notice is currently active (e.g., immediate water supply disruption).
* **Recent Updates Widget:** A card grid displaying the 3 most recently published notices.
* **Quick Links:** Icon-based links to frequently accessed areas (e.g., "Latest Meeting Minutes", "RWA Registration Forms").

### B. Notice Board (`/notices`)

* **Filter Bar:** Client-side component to filter notices by categories (e.g., `General`, `Maintenance`, `Security`, `Gate Access Restrictions`, `Utilities`).
* **Notice Feed:** A list of card components showing the title, date, category pill, and a brief text excerpt.
* **Pagination:** Standard "Previous / Next" controls.

### C. Authority Correspondence (`/authority`)

* **Context Text:** A brief explainer that this section tracks official representations to civic bodies (e.g., Noida Authority, local police).
* **Correspondence Table:**
* Columns: Date, Subject (e.g., "Neighborhood Street Light Maintenance", "Road Repair Request"), Recipient/Sender, Status (Pending, Resolved), and a PDF Download Link.



### D. Meeting Minutes (`/meetings`)

* **Timeline View:** Grouped by year (month-level grouping deferred — low volume in V1 makes year sections sufficient; revisit once a sector has multiple meetings per month).
* **Meeting Type:** Each meeting is tagged with a type — `AGM` (Annual General Meeting), `EGM` (Emergency/Extraordinary General Meeting), `WORKING_COMMITTEE`, or `GENERAL_MEETING` (`MeetingType` enum, `04-data-model.md`) — shown as a colored pill (`src/lib/meeting-type.ts`) next to the date.
* **MOM Item:** Uses the shared `DownloadRow` component — meeting title, date, type pill, and a prominent "Download PDF" button for the official minutes.
* **File storage note:** PDFs are currently served as static files from `public/documents/mom/` (plain URL paths in `fileUrl`), not yet through MinIO/S3 presigned URLs — that wiring lands with the admin upload flow (`09-file-document-management.md`); the `fileUrl` field's contract ("S3 object key or public URL") already accommodates both.

### E. About & Directory (`/about`)

* **Board Members:** A grid showing current RWA committee members, their roles (President, Secretary, Treasurer), tap-to-call phone numbers, and residence address. Implemented as static data (`src/lib/contacts.ts`) rather than a DB model — office-bearer turnover is infrequent enough (annual/biennial elections) that editing this file directly is an acceptable update path for V1; revisit if churn increases.
* **Security Contacts:** Day/night security in-charge names and tap-to-call numbers — added beyond the original spec since residents are more likely to need these for day-to-day issues than the board's numbers.
* **Contact Info:** General inquiry email (currently `rwa43Noida@gmail.com`, sourced from the same `contacts.ts`). No separate registered address is published yet — only committee members' individual addresses.

### F. Membership & Dues (`/membership`)

Added post-launch in response to resident feedback requesting fee-payment transparency (some residents have paid registration/development/security fees, some haven't, and the RWA wants that visible rather than disputed informally).

* **House-keyed table:** One row per house (house number is the natural key — no separate resident-ID system exists). Columns: House No., Owner, Registration Fee, Development Fund (₹15,000 **one-time**), Security Charges (₹10,000 **annual** — per the RWA's own notice, `notice_sample.md`: "रु. 10,000/-- वार्षिक सिक्योरिटी गार्ड चार्ज").
* **Known modelling gap (annual fee):** the current shape stores one paid/unpaid status per fee, which can't express *which year* an annual security charge was paid for. It effectively means "paid for the current cycle". This must be revisited before a second year's collection starts — likely a `securityChargeYears: number[]` or a separate per-year payment row. Flagged rather than silently modelled wrong.
* **Paid/Not-Paid styling:** Green with amount + date when paid; red "Not Paid" when not — deliberately blunt, since the point is visible accountability. See `src/components/public/FeeStatusCell.tsx`.
* **Running total:** Sum of all amounts actually recorded as paid, displayed prominently ("Total funds collected to date") so the RWA and residents can both see aggregate finances, not just individual status.
* **Mobile-first layout:** A wide 5-column table doesn't work on a phone (see `05-public-ui.md`'s mobile-first principle) — renders as one card per house below the `sm` breakpoint, a real `<table>` above it, sharing the same `FeeStatusCell` so the two never disagree.
* **Data source & privacy note:** Static data (`src/lib/membership.ts`), empty by default — no real resident data existed at the time this was built, and fabricated names/addresses were deliberately not used to avoid ever looking like real data. The RWA adds real per-house records directly to that file (format documented inline) as fees are collected. Payment mode/reference numbers are intentionally *not* a field — only amount and date — to avoid publishing bank/UPI reference numbers alongside personal financial status. Like Meetings, this is the strongest candidate for a future admin-managed DB table once admin auth exists, since it changes with every payment.
* **Quick Actions entry point:** A Home page tile ("Membership & Dues") alongside Meeting Minutes/Contact/All Notices. The "Bylaws & Forms" tile (→ `/documents`) is commented out in `src/app/(public)/page.tsx` for now, not deleted — `/documents` has no real content yet, so 4 tiles are shown rather than one leading nowhere; re-enable once Documents is built.

---

## 4. URL and Naming Conventions

* **Slugs:** Individual content pages will use URL-friendly slugs generated from titles rather than database IDs for better SEO (e.g., `/notices/diwali-celebration-schedule-2026` rather than `/notices/12`).
* **Asset URLs:** PDFs and images served from object storage will retain their original filenames appended with a short hash to prevent caching collisions (e.g., `agm-minutes-2026-a7b9.pdf`).