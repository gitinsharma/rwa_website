import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { NOTICE_CATEGORY_META } from "@/lib/notice-category";
import { getNoticeBySlug } from "@/lib/notices";

type NoticePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: NoticePageProps): Promise<Metadata> {
  const { slug } = await params;
  const notice = await getNoticeBySlug(slug);
  if (!notice) return {};

  return {
    title: notice.title,
    description: notice.content.slice(0, 160),
  };
}

export default async function NoticeDetailPage({ params }: NoticePageProps) {
  const { slug } = await params;
  const notice = await getNoticeBySlug(slug);
  if (!notice) notFound();

  const meta = NOTICE_CATEGORY_META[notice.category];

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href="/notices"
        className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to Notices
      </Link>

      <div className="mt-4 flex items-center gap-3">
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${meta.className}`}
        >
          {meta.label}
        </span>
        <time
          dateTime={notice.createdAt.toISOString()}
          className="text-xs text-slate-500 dark:text-slate-400"
        >
          {notice.createdAt.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </time>
      </div>

      <h1 className="mt-3 text-2xl font-bold text-slate-900 dark:text-slate-100">
        {notice.title}
      </h1>

      <p className="mt-6 whitespace-pre-wrap text-slate-700 dark:text-slate-300">
        {notice.content}
      </p>
    </article>
  );
}
