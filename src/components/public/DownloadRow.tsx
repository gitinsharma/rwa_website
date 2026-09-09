import type { ReactNode } from "react";
import { Download, FileText, type LucideIcon } from "lucide-react";

type DownloadRowProps = {
  title: string;
  date: Date;
  fileUrl: string;
  typeIcon?: LucideIcon;
  /** Optional category/type pill (e.g. the AGM/EGM badge) shown next to the date. */
  badge?: ReactNode;
};

/** Standardized row for any downloadable PDF — used by Meetings, and meant
 * to be reused by Documents/Authority once those pages move past their
 * placeholders. Mobile-first: stacks to two lines on narrow screens,
 * collapsing to the title + download button (per 05-public-ui.md §3). */
export function DownloadRow({
  title,
  date,
  fileUrl,
  typeIcon: TypeIcon = FileText,
  badge,
}: DownloadRowProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
      <div className="flex min-w-0 items-start gap-3">
        <TypeIcon
          className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400"
          aria-hidden="true"
        />
        <div className="min-w-0">
          <p className="font-medium break-words text-slate-900 dark:text-slate-100">
            {title}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            {badge}
            <time
              dateTime={date.toISOString()}
              className="text-xs text-slate-500 dark:text-slate-500"
            >
              {date.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </time>
          </div>
        </div>
      </div>

      <a
        href={fileUrl}
        download
        className="flex min-h-11 shrink-0 items-center gap-1.5 rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-700 hover:border-blue-300 hover:text-blue-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-blue-800 dark:hover:text-blue-400"
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        Download PDF
      </a>
    </div>
  );
}
