"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { FeeStatusCell } from "@/components/public/FeeStatusCell";
import { EmptyState } from "@/components/public/EmptyState";
import type { MembershipRecord } from "@/lib/membership";

const LEGEND = [
  { label: "Paid", className: "bg-emerald-500" },
  { label: "Not Paid", className: "bg-red-500" },
  { label: "Pending", className: "bg-amber-500" },
];

// Bounded so the header can stay sticky within it — the page scrolls to
// reach the table, then the table scrolls internally for its rows, which
// is what keeps House No./Owner/fee columns visible at any scroll depth
// even with 200+ rows (per your feedback — cards didn't scale to that).
const TABLE_MAX_HEIGHT = "70vh";

/**
 * Client boundary for `/membership`: owns the search-box state and filters
 * the (server-provided) records list by house number or owner name. Single
 * table at every breakpoint (no separate mobile card layout — a compact
 * table with a sticky header scans a long list far faster than a stack of
 * cards once there are 200 houses, which cards don't scale to).
 */
export function MembershipTable({
  records,
}: {
  records: MembershipRecord[];
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return records;
    return records.filter(
      (record) =>
        record.houseNumber.toLowerCase().includes(q) ||
        record.ownerName.toLowerCase().includes(q),
    );
  }, [records, query]);

  return (
    <div>
      {records.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="relative flex-1 sm:max-w-xs">
            <Search
              className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by house no. or name…"
              aria-label="Search by house number or owner name"
              className="min-h-11 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </label>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-500">
            <span>{filtered.length} of {records.length} houses</span>
            {LEGEND.map((item) => (
              <span key={item.label} className="flex items-center gap-1.5">
                <span
                  className={`h-2 w-2 rounded-full ${item.className}`}
                  aria-hidden="true"
                />
                {item.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {records.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={Search}
            message="No membership fee records have been published yet. Check back soon."
          />
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={Search}
            message={`No house or resident matches "${query}".`}
          />
        </div>
      ) : (
        <div
          className="mt-6 overflow-auto rounded-lg border border-slate-200 dark:border-slate-800"
          style={{ maxHeight: TABLE_MAX_HEIGHT }}
        >
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="sticky top-0 z-10 bg-white text-left shadow-[0_1px_0_0] shadow-slate-200 dark:bg-slate-950 dark:shadow-slate-800">
                <th className="px-3 py-2.5 font-medium whitespace-nowrap text-slate-500 dark:text-slate-500">
                  House No.
                </th>
                <th className="px-3 py-2.5 font-medium whitespace-nowrap text-slate-500 dark:text-slate-500">
                  Owner
                </th>
                <th className="px-3 py-2.5 font-medium whitespace-nowrap text-slate-500 dark:text-slate-500">
                  Registration Fee
                </th>
                <th className="px-3 py-2.5 font-medium whitespace-nowrap text-slate-500 dark:text-slate-500">
                  Development Fund
                </th>
                <th className="px-3 py-2.5 font-medium whitespace-nowrap text-slate-500 dark:text-slate-500">
                  Security Charges
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((record) => (
                <tr
                  key={record.houseNumber}
                  className="border-b border-slate-100 last:border-0 dark:border-slate-900"
                >
                  <td className="px-3 py-2.5 font-medium whitespace-nowrap text-slate-900 dark:text-slate-100">
                    {record.houseNumber}
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap text-slate-700 dark:text-slate-300">
                    {record.ownerName}
                  </td>
                  <td className="px-3 py-2.5">
                    <FeeStatusCell fee={record.registrationFee} />
                  </td>
                  <td className="px-3 py-2.5">
                    <FeeStatusCell fee={record.developmentFund} />
                  </td>
                  <td className="px-3 py-2.5">
                    <FeeStatusCell fee={record.securityCharges} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
