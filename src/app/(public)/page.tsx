import Link from "next/link";
import { Landmark, Megaphone, Phone, Users } from "lucide-react";
// FileText was for the commented-out "Bylaws & Forms" tile below — re-import
// when that's re-added.
import { AlertStrip } from "@/components/public/AlertStrip";
import { HeroCarousel } from "@/components/public/HeroCarousel";
import { NoticeCard } from "@/components/public/NoticeCard";
import { EmptyState } from "@/components/public/EmptyState";
import { getActiveUrgentNotice, getRecentNotices } from "@/lib/notices";

// Home page uses the root layout's default title/description as-is
// (see src/app/layout.tsx) rather than redeclaring them here.

// See public/images/hero/README.md for the filename convention and how to
// swap these placeholders for real photos.
//
// TEMPORARY — local testing only. Points at gitignored `test-*` files (see
// .gitignore) so this never gets committed/deployed. Two of the three test
// images are not cleared for publishing (real-estate marketing watermark,
// political party branding — see chat history). Swap this back to the
// hero-*.svg / real-photo array below before committing.
const HERO_IMAGES = [
  { src: "/images/hero/test-noida.jpg", alt: "[TEST ONLY] Welcome to Noida gate" },
  { src: "/images/hero/test-sector43-layout.png", alt: "[TEST ONLY] Sector 43 layout map — not cleared for publishing" },
  { src: "/images/hero/test-yogi.jpg", alt: "[TEST ONLY] Political greeting graphic — not cleared for publishing" },
];

// const HERO_IMAGES = [
//   { src: "/images/hero/hero-1.svg", alt: "Sector 43 main gate" },
//   { src: "/images/hero/hero-2.svg", alt: "Sector 43 community park" },
//   { src: "/images/hero/hero-3.svg", alt: "Sector 43 clubhouse and amenities" },
//   { src: "/images/hero/hero-4.svg", alt: "Sector 43 neighbourhood streets" },
// ];

const QUICK_ACTIONS = [
  { href: "/meetings", label: "Meeting Minutes", icon: Landmark },
  // Commented out for now — /documents has no real content yet. Re-add
  // once the Documents section (bylaws/forms) is actually built.
  // { href: "/documents", label: "Bylaws & Forms", icon: FileText },
  { href: "/about", label: "Contact", icon: Phone },
  { href: "/membership", label: "Membership & Dues", icon: Users },
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
      <section className="relative border-b border-slate-200 dark:border-slate-800">
        <HeroCarousel images={HERO_IMAGES} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 px-4 pb-6 sm:px-6 sm:pb-10">
          <div className="mx-auto max-w-5xl">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-4xl">
              Sector 43 RWA
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-white/90 sm:mt-3 sm:text-base">
              The official information hub for Sector 43, Noida — notices,
              meeting minutes, RWA documents, and correspondence with civic
              authorities, all in one place for residents.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mx-auto max-w-5xl px-4 py-8 sm:py-10 sm:px-6">
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
