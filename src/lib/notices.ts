import "server-only";
import { prisma } from "@/lib/prisma";
import type { Notice } from "@prisma/client";

const URGENT_WINDOW_HOURS = 48;

/**
 * The 3 most recently published notices, for the homepage "Recent Updates"
 * feed. Returns an empty array (never throws) so a transient DB issue
 * degrades to an empty state instead of taking down the public homepage.
 */
export async function getRecentNotices(limit = 3): Promise<Notice[]> {
  try {
    return await prisma.notice.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  } catch (error) {
    console.error("getRecentNotices failed", error);
    return [];
  }
}

/** All published notices, most recent first, for the `/notices` list page. */
export async function getPublishedNotices(): Promise<Notice[]> {
  try {
    return await prisma.notice.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("getPublishedNotices failed", error);
    return [];
  }
}

/** A single published notice by slug, for `/notices/[slug]`. Returns `null`
 * (never throws) both when the slug doesn't exist and on a transient DB
 * error — the page treats both as "not found". */
export async function getNoticeBySlug(slug: string): Promise<Notice | null> {
  try {
    return await prisma.notice.findFirst({
      where: { slug, isPublished: true },
    });
  } catch (error) {
    console.error("getNoticeBySlug failed", error);
    return null;
  }
}

/**
 * The most recent published URGENT notice created within the last 48 hours,
 * for the homepage alert strip. Older urgent notices stop surfacing here
 * automatically once the window elapses.
 */
export async function getActiveUrgentNotice(): Promise<Notice | null> {
  try {
    const since = new Date(Date.now() - URGENT_WINDOW_HOURS * 60 * 60 * 1000);
    return await prisma.notice.findFirst({
      where: {
        isPublished: true,
        category: "URGENT",
        createdAt: { gte: since },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("getActiveUrgentNotice failed", error);
    return null;
  }
}
