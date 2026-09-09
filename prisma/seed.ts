/**
 * Local/dev sample data — NOT run in production. Seeds one admin user and a
 * handful of published notices (including one URGENT/recent one) so the
 * public pages have real content to review during development.
 */
import { PrismaClient, NoticeCategory, MeetingType } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("changeme123", 10);

  const admin = await prisma.adminUser.upsert({
    where: { email: "admin@sector43rwa.in" },
    update: {},
    create: {
      email: "admin@sector43rwa.in",
      passwordHash,
      name: "RWA Admin",
      role: "SUPERADMIN",
    },
  });

  const notices: Array<{
    slug: string;
    title: string;
    content: string;
    category: NoticeCategory;
    hoursAgo: number;
  }> = [
    {
      slug: "water-supply-disruption-sept-2026",
      title: "Water Supply Disruption on 12th September",
      content:
        "Noida Authority has scheduled essential pipeline maintenance affecting Sector 43 water supply between 10 AM and 4 PM on 12th September. Residents are advised to store water in advance. We apologize for the inconvenience.",
      category: NoticeCategory.URGENT,
      hoursAgo: 6,
    },
    {
      slug: "diwali-celebration-schedule-2026",
      title: "Diwali Celebration Schedule 2026",
      content:
        "The RWA is organizing a community Diwali celebration in the central park on the evening of the festival. Expect rangoli competitions, a cultural program, and refreshments for all residents.",
      category: NoticeCategory.EVENTS,
      hoursAgo: 20,
    },
    {
      slug: "annual-maintenance-charges-due",
      title: "Annual Maintenance Charges Due by Month End",
      content:
        "Residents are reminded that annual maintenance charges for the upcoming cycle are due by the end of this month. Payment details have been shared over the resident WhatsApp group; contact the RWA office for queries.",
      category: NoticeCategory.MAINTENANCE,
      hoursAgo: 72,
    },
    {
      slug: "revised-visitor-gate-entry-procedure",
      title: "Revised Visitor Gate Entry Procedure",
      content:
        "Effective immediately, all visitors must be pre-registered by residents via the security desk at least 30 minutes in advance. This is part of an ongoing effort to improve gate security across Sector 43.",
      category: NoticeCategory.GATE_ACCESS,
      hoursAgo: 120,
    },
    {
      slug: "cctv-upgrade-completed-common-areas",
      title: "CCTV Upgrade Completed in Common Areas",
      content:
        "The RWA has completed installation of upgraded CCTV cameras covering all common areas, park entrances, and the main gate, as part of the ongoing security enhancement initiative.",
      category: NoticeCategory.SECURITY,
      hoursAgo: 200,
    },
  ];

  for (const notice of notices) {
    const createdAt = new Date(Date.now() - notice.hoursAgo * 60 * 60 * 1000);
    await prisma.notice.upsert({
      where: { slug: notice.slug },
      update: {},
      create: {
        slug: notice.slug,
        title: notice.title,
        content: notice.content,
        category: notice.category,
        isPublished: true,
        authorId: admin.id,
        createdAt,
        updatedAt: createdAt,
      },
    });
  }

  const meetings: Array<{
    title: string;
    meetingDate: Date;
    meetingType: MeetingType;
    summary: string;
  }> = [
    {
      title: "First Annual General Meeting (AGM) 2026 — A-Block",
      // 30 Oct 2026, 11:00 AM
      meetingDate: new Date(Date.UTC(2026, 9, 30, 5, 30)),
      meetingType: MeetingType.AGM,
      summary:
        "First AGM of A-Block, Sector 43, Noida — annual budget review, committee elections, and resident Q&A.",
    },
    {
      title: "Working Committee Meeting — Security & Gate Access Review",
      meetingDate: new Date(Date.UTC(2026, 7, 14, 12, 0)),
      meetingType: MeetingType.WORKING_COMMITTEE,
      summary:
        "Working committee review of the revised visitor gate entry procedure and CCTV upgrade rollout.",
    },
    {
      title: "Emergency General Meeting — Water Supply Contingency",
      meetingDate: new Date(Date.UTC(2026, 8, 5, 11, 0)),
      meetingType: MeetingType.EGM,
      summary:
        "EGM called to approve emergency tanker arrangements during the Noida Authority pipeline maintenance window.",
    },
    {
      title: "General Meeting — Diwali Celebration Planning",
      meetingDate: new Date(Date.UTC(2025, 10, 2, 18, 0)),
      meetingType: MeetingType.GENERAL_MEETING,
      summary:
        "Resident meeting to plan the community Diwali celebration, budget, and volunteer sign-up.",
    },
  ];

  // Placeholder PDF for local/demo use only — not the actual signed minutes
  // of any real meeting. Replace via the (future) admin upload flow.
  const dummyFileUrl = "/documents/mom/2026-10-30-first-agm-a-block.pdf";

  for (const meeting of meetings) {
    const existing = await prisma.meetingMinute.findFirst({
      where: { title: meeting.title, meetingDate: meeting.meetingDate },
    });
    if (existing) continue;

    await prisma.meetingMinute.create({
      data: {
        title: meeting.title,
        meetingDate: meeting.meetingDate,
        meetingType: meeting.meetingType,
        summary: meeting.summary,
        fileUrl: dummyFileUrl,
        authorId: admin.id,
      },
    });
  }

  console.log(
    `Seeded 1 admin user, ${notices.length} notices, and ${meetings.length} meeting minutes.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
