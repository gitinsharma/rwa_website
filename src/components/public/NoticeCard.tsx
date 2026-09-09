import Link from "next/link";
import type { NoticeCategory } from "@prisma/client";
import { NOTICE_CATEGORY_META } from "@/lib/notice-category";

type NoticeCardProps = {
  title: string;
  date: Date;
  category: NoticeCategory;
  slug: string;
  excerpt: string;
};

/** Summarized notice block used on the homepage feed and `/notices` list. */
export function NoticeCard({
  title,
  date,
  category,
  slug,
  excerpt,
}: NoticeCardProps) {
  const meta = NOTICE_CATEGORY_META[category];

  return (
    <Link
      href={`/notices/${slug}`}
      className="group flex flex-col gap-3 rounded-lg border border-slate-200 p-5 transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:hover:border-slate-700 dark:hover:bg-slate-900"
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${meta.className}`}
        >
          {meta.label}
        </span>
        <time
          dateTime={date.toISOString()}
          className="text-xs text-slate-500 dark:text-slate-400"
        >
          {date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </time>
      </div>
      <h3 className="font-semibold text-slate-900 group-hover:underline dark:text-slate-100">
        {title}
      </h3>
      <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
        {excerpt}
      </p>
    </Link>
  );
}
