"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TriangleAlert, X } from "lucide-react";

type AlertStripProps = {
  notice: { id: string; slug: string; title: string } | null;
};

const DISMISSED_KEY = "rwa:dismissed-urgent-notice";

/**
 * Renders only when the server has resolved an active URGENT notice
 * (published, created within the last 48h — see `getActiveUrgentNotice`).
 * The client boundary exists solely for the dismiss interaction: closing
 * the strip is remembered per-notice in localStorage so it doesn't reappear
 * on every page view for the same notice.
 */
export function AlertStrip({ notice }: AlertStripProps) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!notice) return;
    setDismissed(localStorage.getItem(DISMISSED_KEY) === notice.id);
  }, [notice]);

  if (!notice || dismissed) return null;

  function handleDismiss() {
    if (notice) localStorage.setItem(DISMISSED_KEY, notice.id);
    setDismissed(true);
  }

  return (
    <div className="border-b border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3 sm:px-6">
        <TriangleAlert
          className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400"
          aria-hidden="true"
        />
        <Link
          href={`/notices/${notice.slug}`}
          className="flex-1 text-sm font-medium text-red-800 hover:underline dark:text-red-200"
        >
          {notice.title}
        </Link>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss alert"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
