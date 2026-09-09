-- CreateEnum
CREATE TYPE "public"."MeetingType" AS ENUM ('AGM', 'EGM', 'WORKING_COMMITTEE', 'GENERAL_MEETING');

-- AlterTable
ALTER TABLE "public"."MeetingMinute" ADD COLUMN     "meetingType" "public"."MeetingType" NOT NULL DEFAULT 'GENERAL_MEETING';
