import type { Metadata } from "next";
import { FileText } from "lucide-react";
import { PlaceholderSection } from "@/components/public/PlaceholderSection";

export const metadata: Metadata = {
  title: "Documents",
  description: "Sector 43 RWA bylaws, registration forms, and compliance documents.",
};

export default function DocumentsPage() {
  return (
    <PlaceholderSection
      title="Documents"
      icon={FileText}
      description="The document library is being built. RWA bylaws, registration forms, and compliance documents will be available for download here."
    />
  );
}
