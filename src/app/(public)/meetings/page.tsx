import type { Metadata } from "next";
import { Landmark } from "lucide-react";
import { DownloadRow } from "@/components/public/DownloadRow";
import { EmptyState } from "@/components/public/EmptyState";
import { MEETING_TYPE_META } from "@/lib/meeting-type";
import { getAllMeetings, groupMeetingsByYear } from "@/lib/meetings";

export const metadata: Metadata = {
  title: "Meeting Minutes",
  description:
    "Archive of Sector 43 RWA meeting minutes — AGMs, EGMs, working committee, and general meetings.",
};

export default async function MeetingsPage() {
  const meetings = await getAllMeetings();
  const meetingsByYear = groupMeetingsByYear(meetings);

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        Meeting Minutes
      </h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        Minutes of Annual General Meetings (AGM), Emergency General Meetings
        (EGM), working committee meetings, and other resident meetings.
      </p>

      {meetings.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={Landmark}
            message="No meeting minutes have been published yet. Check back soon."
          />
        </div>
      ) : (
        <div className="mt-8 space-y-10">
          {meetingsByYear.map(([year, yearMeetings]) => (
            <div key={year}>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {year}
              </h2>
              <div className="mt-3 space-y-3">
                {yearMeetings.map((meeting) => {
                  const meta = MEETING_TYPE_META[meeting.meetingType];
                  return (
                    <DownloadRow
                      key={meeting.id}
                      title={meeting.title}
                      date={meeting.meetingDate}
                      fileUrl={meeting.fileUrl}
                      typeIcon={Landmark}
                      badge={
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${meta.className}`}
                        >
                          {meta.label}
                        </span>
                      }
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
