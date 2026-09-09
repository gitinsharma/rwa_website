import type { NoticeCategory } from "@prisma/client";

/** Human label + pill styling for each notice category, kept in one place
 * so `NoticeCard` and the (future) `FilterPills` component stay in sync. */
export const NOTICE_CATEGORY_META: Record<
  NoticeCategory,
  { label: string; className: string }
> = {
  URGENT: {
    label: "Urgent",
    className: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  },
  GENERAL: {
    label: "General",
    className:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
  MAINTENANCE: {
    label: "Maintenance",
    className:
      "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  },
  SECURITY: {
    label: "Security",
    className:
      "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  },
  GATE_ACCESS: {
    label: "Gate Access",
    className:
      "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  },
  EVENTS: {
    label: "Events",
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  },
};
