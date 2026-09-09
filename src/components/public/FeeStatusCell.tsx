import { CheckCircle2, Circle, XCircle } from "lucide-react";
import { formatRupees, type FeePayment } from "@/lib/membership";

/** Renders one fee's status — green when paid, red "Not Paid" when
 * confirmed unpaid, amber "Pending" when simply not yet recorded (never
 * conflated with "Not Paid" — see 02-information-architecture.md §F).
 * Shared between the table (desktop) and card (mobile) layouts on
 * `/membership` so the two never drift. */
export function FeeStatusCell({ fee }: { fee: FeePayment }) {
  if (fee.status === "PAID") {
    return (
      <div className="flex items-start gap-1.5">
        <CheckCircle2
          className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400"
          aria-hidden="true"
        />
        <div>
          <p className="font-medium text-emerald-700 dark:text-emerald-400">
            Paid
          </p>
          {(fee.amount || fee.date) && (
            <p className="text-xs text-slate-500 dark:text-slate-500">
              {fee.amount ? formatRupees(fee.amount) : null}
              {fee.amount && fee.date ? " · " : null}
              {fee.date
                ? new Date(fee.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : null}
            </p>
          )}
          {fee.note && (
            <p className="text-xs text-slate-500 dark:text-slate-500">
              {fee.note}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (fee.status === "PENDING") {
    return (
      <div className="flex items-center gap-1.5">
        <Circle
          className="h-4 w-4 shrink-0 text-amber-500 dark:text-amber-400"
          aria-hidden="true"
        />
        <span className="font-medium text-amber-700 dark:text-amber-400">
          Pending
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <XCircle
        className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400"
        aria-hidden="true"
      />
      <span className="font-medium text-red-700 dark:text-red-400">
        Not Paid
      </span>
    </div>
  );
}
