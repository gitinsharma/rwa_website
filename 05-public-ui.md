
## 1. Design System & Styling

The public-facing portal prioritizes readability, fast loading, and mobile responsiveness.

* **Framework:** Tailwind CSS for all styling.
* **Typography:** System sans-serif fonts (e.g., Inter or Roboto) for clean, high-contrast reading.
* **Color Palette:** Neutral backgrounds (white/slate) with a primary brand color (e.g., a dignified blue or green) for links, buttons, and active states.
* **Icons:** Lucide React or Heroicons for lightweight, consistent iconography.

## 2. Core Reusable Components

To maintain visual consistency and reduce code duplication, the following shared components will be built.

| Component | Component Type | Expected Props | Primary Responsibility |
| --- | --- | --- | --- |
| `NoticeCard` | Server | `title`, `date`, `category`, `slug`, `excerpt` | Renders a summarized notice block for feeds and the homepage. |
| `FilterPills` | Client | `categories`, `activeFilter`, `onSelect` | Provides clickable tabs to filter list views (e.g., sorting notices by "Urgent"). |
| `DownloadRow` | Server | `title`, `date`, `fileUrl`, `typeIcon` | Standardized list row for any downloadable PDF (Meetings, Documents, Authority). |
| `EmptyState` | Server | `message`, `icon` | Displays a friendly fallback when a category or search yields no results. |
| `Pagination` | Client | `currentPage`, `totalPages`, `baseRoute` | Manages page navigation for long lists. |

## 3. Page Assembly (Public Routes)

### Home Page (`/`)

* **Hero Banner:** Static welcome message.
* **Alert Strip (Client):** Conditionally fetches and displays any notice marked as `URGENT` within the last 48 hours.
* **Recent Feed (Server):** Fetches the 3 most recently published `Notice` records.
* **Quick Actions (Server):** Static grid of 4 buttons routing to key sections (Meetings, Bylaws, Contact, Notices).

### Notices (`/notices` & `/notices/[slug]`)

* **List View:** Server-rendered list of `NoticeCard` components. Implements URL-based filtering (e.g., `?category=security`) so filters are shareable and bookmarkable.
* **Detail View:** Renders the full `content` field. Includes a dynamic `<title>` tag for SEO based on the notice title.

### Document & Authority Tables (`/documents`, `/authority`, `/meetings`)

* **Tabular Layout:** Uses the `DownloadRow` component inside a responsive CSS Grid or Table layout.
* **Mobile Behavior:** Columns gracefully collapse on small screens, prioritizing the title and the download button.

## 4. Data Fetching Strategy

* **Static Generation (SSG):** Pages like `/about` and `/documents` will be statically generated at build time and revalidated using Next.js Incremental Static Regeneration (ISR) when an admin updates the database.
* **Dynamic Rendering:** Search results and highly active filtered views will utilize dynamic server rendering to ensure residents always see the most up-to-date information.

Are you ready to move on to `06-admin-ui.md` to define the secure dashboard and content editor interfaces?