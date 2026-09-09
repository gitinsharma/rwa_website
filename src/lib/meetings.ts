import "server-only";
import { prisma } from "@/lib/prisma";
import type { MeetingMinute } from "@prisma/client";

/** All meeting minutes, most recent first, for the `/meetings` timeline.
 * Never throws — returns an empty array on a transient DB issue so the page
 * degrades to an empty state instead of crashing. */
export async function getAllMeetings(): Promise<MeetingMinute[]> {
  try {
    return await prisma.meetingMinute.findMany({
      orderBy: { meetingDate: "desc" },
    });
  } catch (error) {
    console.error("getAllMeetings failed", error);
    return [];
  }
}

/** Groups meetings by calendar year, preserving the most-recent-first
 * ordering within each year, for the timeline's year-by-year sections. */
export function groupMeetingsByYear(
  meetings: MeetingMinute[],
): Array<[number, MeetingMinute[]]> {
  const byYear = new Map<number, MeetingMinute[]>();
  for (const meeting of meetings) {
    const year = meeting.meetingDate.getUTCFullYear();
    const existing = byYear.get(year);
    if (existing) {
      existing.push(meeting);
    } else {
      byYear.set(year, [meeting]);
    }
  }
  return Array.from(byYear.entries()).sort(([a], [b]) => b - a);
}
