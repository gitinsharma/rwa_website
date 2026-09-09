import type { Metadata } from "next";
import { Users } from "lucide-react";
import { PlaceholderSection } from "@/components/public/PlaceholderSection";

export const metadata: Metadata = {
  title: "About & Contact",
  description:
    "About Sector 43 RWA, the current governing body, and contact information.",
};

export default function AboutPage() {
  return (
    <PlaceholderSection
      title="About & Contact"
      icon={Users}
      description="The RWA directory is being built. Current board members, their roles, and official contact details will be listed here, along with the registered address."
    />
  );
}
