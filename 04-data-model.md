
## 1. Schema Design Principles

* **Single Source of Truth:** PostgreSQL handles all relational data, metadata, and state.
* **File References:** Physical files (PDFs, images) are stored in S3, while the database stores the `file_url` or `storage_key` to retrieve them.
* **Auditability:** All major content tables track `createdAt`, `updatedAt`, and the `authorId` of the admin who created them.
* **Soft Publishing:** Content uses boolean flags (e.g., `isPublished`) to allow draft states before making them visible on public routes.

## 2. Prisma Schema (`schema.prisma`)

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// -----------------------------------------------------------------------------
// Admin & Auth
// -----------------------------------------------------------------------------

model AdminUser {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String
  name         String
  role         Role     @default(EDITOR)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  notices      Notice[]
  meetings     MeetingMinute[]
}

enum Role {
  SUPERADMIN
  EDITOR
}

// -----------------------------------------------------------------------------
// Core Content Models
// -----------------------------------------------------------------------------

model Notice {
  id          String         @id @default(uuid())
  slug        String         @unique
  title       String
  content     String         @db.Text
  category    NoticeCategory @default(GENERAL)
  isPublished Boolean        @default(false)
  
  authorId    String
  author      AdminUser      @relation(fields: [authorId], references: [id])
  
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt

  @@index([isPublished, createdAt(sort: Desc)])
}

enum NoticeCategory {
  URGENT
  GENERAL
  MAINTENANCE
  SECURITY
  GATE_ACCESS
  EVENTS
}

model MeetingMinute {
  id          String    @id @default(uuid())
  meetingDate DateTime  @db.Date
  title       String
  summary     String?   @db.Text
  fileUrl     String    // S3 object key or public URL
  
  authorId    String
  author      AdminUser @relation(fields: [authorId], references: [id])

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([meetingDate(sort: Desc)])
}

model Document {
  id          String       @id @default(uuid())
  title       String
  description String?      @db.Text
  fileUrl     String
  docType     DocumentType @default(GENERAL)
  
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}

enum DocumentType {
  BYLAW
  FORM
  COMPLIANCE
  GENERAL
}

model AuthorityLetter {
  id            String          @id @default(uuid())
  referenceDate DateTime        @db.Date
  subject       String
  authorityName String          // e.g., "Noida Authority", "Police"
  direction     LetterDirection
  status        LetterStatus    @default(PENDING)
  fileUrl       String
  
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt

  @@index([referenceDate(sort: Desc)])
}

enum LetterDirection {
  SENT_TO_AUTHORITY
  RECEIVED_FROM_AUTHORITY
}

enum LetterStatus {
  PENDING
  RESOLVED
  INFO_ONLY
}

```

## 3. Storage Key Strategy

Whenever a file is uploaded for a `MeetingMinute`, `Document`, or `AuthorityLetter`, the system will generate a UUID-prefixed string (e.g., `meetings/2026-09-15-agm-f4a2.pdf`) to store in S3. This precise string is saved to the `fileUrl` field in the database, preventing naming collisions if two files happen to have the same original name.