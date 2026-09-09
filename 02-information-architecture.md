
## 1. Site Map & Route Structure

The application is divided into two strict routing zones: the Public UI (accessible to all residents) and the Admin UI (protected behind authentication).

### Public Routes

* `/` (Home)
* `/notices` (Paginated list of all announcements)
* `/notices/[slug]` (Individual notice view)


* `/meetings` (MOM archive)
* `/documents` (General RWA documents, bylaws)
* `/authority` (Official correspondence)
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

* **Header:** Sticky navigation bar containing the RWA Logo, primary navigation links (`Notices`, `Meetings`, `Documents`, `Authority`), and a mobile hamburger menu.
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

* **Timeline View:** Grouped by year and month.
* **MOM Item:** Displays the meeting date, a summary of key agenda items, and a prominent "Download PDF" button for the official minutes.

### E. About & Directory (`/about`)

* **Board Members:** A grid showing current RWA committee members, their roles (President, Secretary, Treasurer), and official contact emails.
* **Contact Info:** Sector 43 RWA registered address and general inquiry email.

---

## 4. URL and Naming Conventions

* **Slugs:** Individual content pages will use URL-friendly slugs generated from titles rather than database IDs for better SEO (e.g., `/notices/diwali-celebration-schedule-2026` rather than `/notices/12`).
* **Asset URLs:** PDFs and images served from object storage will retain their original filenames appended with a short hash to prevent caching collisions (e.g., `agm-minutes-2026-a7b9.pdf`).