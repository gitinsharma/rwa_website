
## 1. Design System & Styling

The public-facing portal prioritizes readability, fast loading, and mobile responsiveness.

* **Mobile-first, not mobile-friendly:** the large majority of residents will only ever view this site on a phone; laptop/desktop viewing is the exception (mainly admins, who also prefer mobile). Every page is designed and reviewed at mobile widths first, then progressively enhanced for larger screens — not the other way around. Interactive elements (buttons, nav links, dismiss controls) target a minimum ~44px touch area per Apple HIG / WCAG guidance, not just visual sizing.
* **Framework:** Tailwind CSS for all styling.
* **Typography:** System sans-serif fonts (e.g., Inter or Roboto) for clean, high-contrast reading.
* **Color Palette:** Neutral backgrounds (white/slate) with a primary brand color (e.g., a dignified blue or green) for links, buttons, and active states.
* **Icons:** Lucide React for lightweight, consistent iconography (implemented; Heroicons was the original alternative, not used).

## 2. Core Reusable Components

To maintain visual consistency and reduce code duplication, the following shared components will be built.

| Component | Component Type | Expected Props | Primary Responsibility |
| --- | --- | --- | --- |
| `NoticeCard` | Server | `title`, `date`, `category`, `slug`, `excerpt` | Renders a summarized notice block for feeds and the homepage. Implemented. |
| `FilterPills` | Client | `categories`, `activeFilter`, `onSelect` | Provides clickable tabs to filter list views (e.g., sorting notices by "Urgent"). Not yet implemented — `/notices` has no filtering yet. |
| `DownloadRow` | Server | `title`, `date`, `fileUrl`, `typeIcon`, `badge` (added: optional type-pill slot, e.g. AGM/EGM) | Standardized list row for any downloadable PDF. Implemented and used by `/meetings`; `/documents` and `/authority` still placeholders pending their own data. |
| `EmptyState` | Server | `message`, `icon` | Displays a friendly fallback when a category or search yields no results. Implemented. |
| `Pagination` | Client | `currentPage`, `totalPages`, `baseRoute` | Manages page navigation for long lists. Not yet implemented — no list is long enough yet to need it. |

## 3. Page Assembly (Public Routes)

### Home Page (`/`)

* **Hero Banner:** Auto-rotating image carousel (`HeroCarousel`, Client — pauses on hover/focus, respects `prefers-reduced-motion`) with the welcome message overlaid on a gradient scrim, rather than a static image. Images live in `public/images/hero/` (currently placeholder SVGs labeled with the intended scene — main gate, community park, clubhouse, streets — swapped for real photos by filename per `public/images/hero/README.md`, no code change needed for a like-for-like swap).
* **Alert Strip (Client):** Conditionally fetches and displays any notice marked as `URGENT` within the last 48 hours.
* **Recent Feed (Server):** Fetches the 3 most recently published `Notice` records.
* **Quick Actions (Server):** Static grid of buttons routing to key sections. Currently Meetings, Contact, Membership & Dues, Notices — "Bylaws" (→ `/documents`) is commented out in code (not deleted) until `/documents` has real content; see `02-information-architecture.md` §F.

### Notices (`/notices` & `/notices/[slug]`)

* **List View:** Server-rendered list of `NoticeCard` components. Implements URL-based filtering (e.g., `?category=security`) so filters are shareable and bookmarkable.
* **Detail View:** Renders the full `content` field. Includes a dynamic `<title>` tag for SEO based on the notice title.

### Meetings (`/meetings`) — implemented

* **Timeline Layout:** Meetings grouped into year sections (most recent year first), each a stack of `DownloadRow` items sorted by date descending — see `02-information-architecture.md` §D for the meeting-type pill and file-storage details.

### Membership & Dues (`/membership`) — implemented

* **Responsive table/cards:** A card-per-house layout below the `sm` breakpoint, a real `<table>` above it, both driven by the same `FeeStatusCell` component (green/amount/date when paid, red "Not Paid" otherwise) — see `02-information-architecture.md` §F for the full rationale (privacy, static data source, future DB model).
* **Total banner:** Running total of all recorded paid amounts, shown above the table/cards.

### Document & Authority Tables (`/documents`, `/authority`) — still placeholders

* **Tabular Layout:** Uses the `DownloadRow` component inside a responsive CSS Grid or Table layout.
* **Mobile Behavior:** Columns gracefully collapse on small screens, prioritizing the title and the download button.

## 4. Data Fetching Strategy

* **Static Generation (SSG):** Pages like `/about` and `/documents` will be statically generated at build time and revalidated using Next.js Incremental Static Regeneration (ISR) when an admin updates the database.
* **Dynamic Rendering:** Search results and highly active filtered views will utilize dynamic server rendering to ensure residents always see the most up-to-date information.

Are you ready to move on to `06-admin-ui.md` to define the secure dashboard and content editor interfaces?