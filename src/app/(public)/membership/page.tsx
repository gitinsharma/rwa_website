import type { Metadata } from "next";
import { MembershipTable } from "@/components/public/MembershipTable";
import {
  DEVELOPMENT_FUND_AMOUNT,
  formatRupees,
  MEMBERSHIP_RECORDS,
  SECURITY_CHARGES_AMOUNT,
} from "@/lib/membership";

export const metadata: Metadata = {
  title: "Membership & Dues",
  description:
    "Sector 43 RWA membership fee transparency — registration, development fund, and security charges paid per house.",
};

export default function MembershipPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        Membership &amp; Dues
      </h1>
      <p className="mt-1 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
        A transparent record of RWA fees per house — registration fee,
        one-time development fund ({formatRupees(DEVELOPMENT_FUND_AMOUNT)}),
        and security charges ({formatRupees(SECURITY_CHARGES_AMOUNT)}).
        Search by house number or name below.
      </p>

      <div className="mt-6">
        <MembershipTable records={MEMBERSHIP_RECORDS} />
      </div>
    </div>
  );
}
