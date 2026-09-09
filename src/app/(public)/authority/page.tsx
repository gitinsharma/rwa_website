import type { Metadata } from "next";
import { Landmark } from "lucide-react";
import { PlaceholderSection } from "@/components/public/PlaceholderSection";

export const metadata: Metadata = {
  title: "Authority Correspondence",
  description:
    "Official correspondence between Sector 43 RWA and civic bodies such as the Noida Authority and local police.",
};

export default function AuthorityPage() {
  return (
    <PlaceholderSection
      title="Authority Correspondence"
      icon={Landmark}
      description="This section will track official letters sent to and received from the Noida Authority, police, and other civic bodies, along with their resolution status."
    />
  );
}
