import Link from "next/link";
import { FileText, Landmark, Megaphone, Phone } from "lucide-react";
import { AlertStrip } from "@/components/public/AlertStrip";
import { NoticeCard } from "@/components/public/NoticeCard";
import { EmptyState } from "@/components/public/EmptyState";
import { getActiveUrgentNotice, getRecentNotices } from "@/lib/notices";

// Home page uses the root layout's default title/description as-is
// (see src/app/layout.tsx) rather than redeclaring them here.

const QUICK_ACTIONS = [
  { href: "/meetings", label: "Meeting Minutes", icon: Landmark },
  { href: "/documents", label: "Bylaws & Forms", icon: FileText },
  { href: "/about", label: "Contact", icon: Phone },
  { href: "/notices", label: "All Notices", icon: Megaphone },
];

export default async function HomePage() {
  const [urgentNotice, recentNotices] = await Promise.all([
    getActiveUrgentNotice(),
    getRecentNotices(3),
  ]);

  return (
    <>
      <AlertStrip notice={urgentNotice} />

      {/* Hero */}
      <section className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100">
            Sector 43 RWA
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
            The official information hub for Sector 43, Noida — notices,
            meeting minutes, RWA documents, and correspondence with civic
            authorities, all in one place for residents.
          </p>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {QUICK_ACTIONS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-2 rounded-lg border border-slate-200 px-4 py-6 text-center transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-slate-800 dark:hover:border-blue-800 dark:hover:bg-blue-950"
            >
              <Icon
                className="h-6 w-6 text-blue-600 dark:text-blue-400"
                aria-hidden="true"
              />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Updates */}
      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Recent Updates
          </h2>
          <Link
            href="/notices"
            className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            View all
          </Link>
        </div>

        {recentNotices.length === 0 ? (
          <EmptyState
            icon={Megaphone}
            message="No notices have been published yet. Check back soon."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            {recentNotices.map((notice) => (
              <NoticeCard
                key={notice.id}
                title={notice.title}
                date={notice.createdAt}
                category={notice.category}
                slug={notice.slug}
                excerpt={notice.content.slice(0, 140)}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
