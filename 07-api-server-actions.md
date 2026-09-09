## 1. Server Action Architecture

Instead of building traditional REST API routes (e.g., `/api/notices`), the application utilizes Next.js Server Actions. These asynchronous JavaScript functions execute strictly on the server, allowing the client-side Admin UI to invoke backend logic directly via function calls. This approach eliminates the need for manual `fetch` boilerplate and tightly couples the mutation logic with TypeScript types.

## 2. Core Mutations (Write Operations)

All server actions will reside in standard location files (e.g., `app/actions/notice-actions.ts`).

### Notice Actions

* `createNotice(data: z.infer<typeof NoticeSchema>)`
* **Logic:** Validates input against Zod schema. Inserts a new record via `prisma.notice.create()`. Automatically generates a URL-friendly `slug` from the title.
* **Revalidation:** Calls `revalidatePath('/notices')` and `revalidatePath('/')`.


* `updateNotice(id: string, data: Partial<z.infer<typeof NoticeSchema>>)`
* **Logic:** Updates existing notice fields. Does *not* regenerate the slug to prevent breaking existing public links.


* `deleteNotice(id: string)`
* **Logic:** Executes `prisma.notice.delete()`.



### Meeting & Document Actions

* `createMeetingMinute(data: MeetingSchema)`
* **Logic:** Inserts meeting metadata alongside the provided `fileUrl` (retrieved from the client-side S3 upload step).


* `deleteDocument(id: string)`
* **Logic:** First, executes an S3 `DeleteObjectCommand` to remove the physical file. Second, executes `prisma.document.delete()` to remove the metadata. This two-step process prevents orphaned files in storage.



## 3. File Upload Orchestration

To prevent routing large PDF payloads through the Next.js server, the application uses a direct-to-S3 upload pattern facilitated by a Server Action.

* `generateUploadUrl(fileName: string, contentType: string)`
* **Logic:**
1. Authenticates the admin session.
2. Generates a unique, collision-proof storage key (e.g., `documents/uuid-filename.pdf`).
3. Uses the AWS SDK to create a short-lived (e.g., 60 seconds) presigned POST URL.


* **Returns:** The presigned URL and the final `storage_key` to the client. The client then pushes the file directly to the S3 bucket using this URL.



## 4. Error Handling & Validation Boundary

* **Zod Parsing:** Every server action begins by parsing the incoming payload with a Zod schema (`Schema.safeParse()`).
* **Authentication Check:** Every mutation strictly verifies the session token using Auth.js before executing database queries. If no valid session exists, it throws a `401 Unauthorized` error.
* **Standardized Responses:** Actions return a typed result object: `{ success: boolean, data?: any, error?: string }`. This allows the client-side forms to easily display toast notifications (success/failure) without crashing.