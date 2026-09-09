import type { LucideIcon } from "lucide-react";

type EmptyStateProps = {
  message: string;
  icon: LucideIcon;
};

/** Friendly fallback shown when a category, feed, or search yields no results. */
export function EmptyState({ message, icon: Icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-slate-300 px-6 py-12 text-center dark:border-slate-700">
      <Icon className="h-8 w-8 text-slate-400" aria-hidden="true" />
      <p className="text-sm text-slate-500 dark:text-slate-400">{message}</p>
    </div>
  );
}
