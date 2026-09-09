import type { MeetingType } from "@prisma/client";

/** Human label + pill styling for each meeting type, mirroring the pattern
 * in notice-category.ts so the two feel consistent across the site. */
export const MEETING_TYPE_META: Record<
  MeetingType,
  { label: string; className: string }
> = {
  AGM: {
    label: "AGM",
    className:
      "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  },
  EGM: {
    label: "EGM",
    className: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  },
  WORKING_COMMITTEE: {
    label: "Working Committee",
    className:
      "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  },
  GENERAL_MEETING: {
    label: "General Meeting",
    className:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
};
