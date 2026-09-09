## 1. Authentication & Layout

* **Login Flow:** A single `/adminrwa/login` page requiring email and password. Upon successful authentication via Auth.js, a secure HTTP-only session cookie is set.
* **App Shell:** Once authenticated, all `/adminrwa` routes share a consistent layout featuring a collapsible left sidebar for navigation and a top bar displaying the current user and logout action.
* **Protection:** Middleware intercepts any unauthenticated request to `/adminrwa/*` and redirects it to the login page.

## 2. Dashboard Overview (`/adminrwa/dashboard`)

The landing page after login provides a high-level operational view.

* **Quick Stats:** Cards showing total published notices, upcoming meetings, and pending authority letters.
* **Recent Activity:** A lightweight table displaying the 5 most recently created or modified records across all content types, providing a quick audit trail for the administrative team.
* **Quick Actions:** Primary buttons for the most common tasks (e.g., "Draft New Notice", "Upload MOM").

## 3. Data Tables (List Views)

Every content type (Notices, Meetings, Documents, Authority) will have a primary management table.

* **Columns:** Status (Draft/Published), Title, Date, Category, and Actions.
* **Actions Column:** Contextual menu (using an ellipsis icon) containing "Edit", "View Public Page", and "Delete".
* **Bulk Actions:** (Deferred to V1.5) Basic V1 will focus on single-row operations to minimize complexity.

## 4. Form Architecture & Validation

All create and edit operations use a standardized form architecture to ensure consistent data quality.

* **Tech Stack:** `react-hook-form` for state management and `zod` for strict schema validation.
* **Notice Editor:** Uses a simple WYSIWYG text editor for the `content` field, allowing basic formatting (bold, lists, links) without requiring HTML knowledge.
* **Date Pickers:** Standardized native or lightweight date pickers for meeting dates and authority reference dates.
* **Validation:** Forms will not submit unless all required fields (e.g., Title, Date) are populated and valid, displaying inline red error messages immediately upon blur or submission attempt.

## 5. File Upload Workflows

Handling PDFs for minutes and documents requires a seamless upload experience.

* **UI Component:** A drag-and-drop zone integrated directly into the creation forms for Meetings, Documents, and Authority Letters.
* **Upload Process:**
1. Client selects a file (restricted to `.pdf`, `.png`, `.jpg`).
2. Client requests a secure, short-lived presigned POST URL from a Server Action.
3. Client uploads the file directly to the S3-compatible storage using the presigned URL.
4. Upon success, the generated `storage_key` is silently attached to the form payload for database insertion.


* **Feedback:** Progress bars and clear success/error toast notifications.

Shall we proceed to `07-api-server-actions.md` to map out the exact server mutations and database queries driving these forms?