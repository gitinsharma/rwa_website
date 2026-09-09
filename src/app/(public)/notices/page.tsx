import type { Metadata } from "next";
import { Megaphone } from "lucide-react";
import { NoticeCard } from "@/components/public/NoticeCard";
import { EmptyState } from "@/components/public/EmptyState";
import { getPublishedNotices } from "@/lib/notices";

export const metadata: Metadata = {
  title: "Notices",
  description:
    "Notices and announcements for Sector 43 residents — urgent alerts, maintenance updates, security notices, and events.",
};

export default async function NoticesPage() {
  const notices = await getPublishedNotices();

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        Notices
      </h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        Announcements from the Sector 43 RWA, most recent first.
      </p>

      <div className="mt-8">
        {notices.length === 0 ? (
          <EmptyState
            icon={Megaphone}
            message="No notices have been published yet. Check back soon."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {notices.map((notice) => (
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
      </div>
    </section>
  );
}
