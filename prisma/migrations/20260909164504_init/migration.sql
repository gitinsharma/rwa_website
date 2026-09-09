-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('SUPERADMIN', 'EDITOR');

-- CreateEnum
CREATE TYPE "public"."NoticeCategory" AS ENUM ('URGENT', 'GENERAL', 'MAINTENANCE', 'SECURITY', 'GATE_ACCESS', 'EVENTS');

-- CreateEnum
CREATE TYPE "public"."DocumentType" AS ENUM ('BYLAW', 'FORM', 'COMPLIANCE', 'GENERAL');

-- CreateEnum
CREATE TYPE "public"."LetterDirection" AS ENUM ('SENT_TO_AUTHORITY', 'RECEIVED_FROM_AUTHORITY');

-- CreateEnum
CREATE TYPE "public"."LetterStatus" AS ENUM ('PENDING', 'RESOLVED', 'INFO_ONLY');

-- CreateTable
CREATE TABLE "public"."AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'EDITOR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Notice" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" "public"."NoticeCategory" NOT NULL DEFAULT 'GENERAL',
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MeetingMinute" (
    "id" TEXT NOT NULL,
    "meetingDate" DATE NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "fileUrl" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MeetingMinute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Document" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "fileUrl" TEXT NOT NULL,
    "docType" "public"."DocumentType" NOT NULL DEFAULT 'GENERAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AuthorityLetter" (
    "id" TEXT NOT NULL,
    "referenceDate" DATE NOT NULL,
    "subject" TEXT NOT NULL,
    "authorityName" TEXT NOT NULL,
    "direction" "public"."LetterDirection" NOT NULL,
    "status" "public"."LetterStatus" NOT NULL DEFAULT 'PENDING',
    "fileUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuthorityLetter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "public"."AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Notice_slug_key" ON "public"."Notice"("slug");

-- CreateIndex
CREATE INDEX "Notice_isPublished_createdAt_idx" ON "public"."Notice"("isPublished", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "MeetingMinute_meetingDate_idx" ON "public"."MeetingMinute"("meetingDate" DESC);

-- CreateIndex
CREATE INDEX "AuthorityLetter_referenceDate_idx" ON "public"."AuthorityLetter"("referenceDate" DESC);

-- AddForeignKey
ALTER TABLE "public"."Notice" ADD CONSTRAINT "Notice_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."AdminUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MeetingMinute" ADD CONSTRAINT "MeetingMinute_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."AdminUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
