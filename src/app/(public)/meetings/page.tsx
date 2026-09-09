import type { Metadata } from "next";
import { Landmark } from "lucide-react";
import { PlaceholderSection } from "@/components/public/PlaceholderSection";

export const metadata: Metadata = {
  title: "Meeting Minutes",
  description: "Archive of Sector 43 RWA meeting minutes (MOM).",
};

export default function MeetingsPage() {
  return (
    <PlaceholderSection
      title="Meeting Minutes"
      icon={Landmark}
      description="The meeting minutes archive is being built. Once published, RWA meeting minutes will be listed here, grouped by year and month, each with a downloadable PDF."
    />
  );
}
