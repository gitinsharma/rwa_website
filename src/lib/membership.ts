/**
 * Static membership/dues transparency data for the `/membership` page.
 * House number is the natural key (one entry per house), not modeled in
 * Postgres yet — see 04-data-model.md for why (this changes with every
 * payment, so it's the strongest future candidate for an admin-managed DB
 * table + CRUD screen, but static is fine while there's no admin auth to
 * gate edits behind).
 *
 * Edit MEMBERSHIP_RECORDS directly as payments come in/get recorded.
 * Source: public/membership_payment_details.md.
 */

export type FeeStatus = "PAID" | "NOT_PAID" | "PENDING";

export type FeePayment = {
  status: FeeStatus;
  amount?: number; // rupees
  date?: string; // "YYYY-MM-DD"
  note?: string; // optional transaction reference/mode
};

export type MembershipRecord = {
  houseNumber: string;
  ownerName: string;
  registrationFee: FeePayment;
  developmentFund: FeePayment;
  securityCharges: FeePayment;
};

// Standard one-time amounts, shown as page-level context regardless of what
// any individual record's `amount` says (a record's own `amount` is the
// actual amount received, in case of partial/adjusted payments — none
// recorded yet, see PENDING note below).
export const DEVELOPMENT_FUND_AMOUNT = 15000;
export const SECURITY_CHARGES_AMOUNT = 10000;

// PENDING = house is a known member but this fee's status hasn't been
// checked/recorded yet — deliberately distinct from NOT_PAID (confirmed
// non-payment) so an unreviewed record never reads as an accusation.
const pending: FeePayment = { status: "PENDING" };

export const MEMBERSHIP_RECORDS: MembershipRecord[] = [
  {
    houseNumber: "A-270",
    ownerName: "Prem Lata Gupta",
    registrationFee: { status: "PAID" },
    developmentFund: { status: "PAID" },
    securityCharges: { status: "PAID" },
  },
  {
    houseNumber: "A-192",
    ownerName: "Dewakar Asthan",
    registrationFee: { status: "PAID" },
    developmentFund: { status: "NOT_PAID" },
    securityCharges: { status: "PAID" },
  },
  {
    houseNumber: "A-187",
    ownerName: "Anuj Chauhan",
    registrationFee: { status: "PAID" },
    developmentFund: { status: "NOT_PAID" },
    securityCharges: { status: "PAID" },
  },
  {
    houseNumber: "B-84",
    ownerName: "Yogesh Arora",
    registrationFee: pending,
    developmentFund: pending,
    securityCharges: pending,
  },
  {
    houseNumber: "A-196",
    ownerName: "L M Aggarwal",
    registrationFee: pending,
    developmentFund: pending,
    securityCharges: pending,
  },
  {
    houseNumber: "A-199",
    ownerName: "Dr P K Jha",
    registrationFee: pending,
    developmentFund: pending,
    securityCharges: pending,
  },
  {
    houseNumber: "A-243",
    ownerName: "Vinod Sharma",
    registrationFee: pending,
    developmentFund: pending,
    securityCharges: pending,
  },
  {
    houseNumber: "A-211",
    ownerName: "Vivek Sharma",
    registrationFee: pending,
    developmentFund: pending,
    securityCharges: pending,
  },
  {
    houseNumber: "C-104",
    ownerName: "Vipin Tyagi",
    registrationFee: pending,
    developmentFund: pending,
    securityCharges: pending,
  },
  {
    houseNumber: "A-272",
    ownerName: "Tushar Dhawan",
    registrationFee: pending,
    developmentFund: pending,
    securityCharges: pending,
  },
  {
    houseNumber: "A-208",
    ownerName: "Vishnu Bajpai",
    registrationFee: pending,
    developmentFund: pending,
    securityCharges: pending,
  },
  {
    houseNumber: "A-128",
    ownerName: "Rajesh Chopra",
    registrationFee: pending,
    developmentFund: pending,
    securityCharges: pending,
  },
  {
    houseNumber: "A-269",
    ownerName: "Yoginder Kataria",
    registrationFee: pending,
    developmentFund: pending,
    securityCharges: pending,
  },
  {
    houseNumber: "A-306",
    ownerName: "Mohit Bhardwaj",
    registrationFee: pending,
    developmentFund: pending,
    securityCharges: pending,
  },
  {
    houseNumber: "A-213",
    ownerName: "Amit Kathuria",
    registrationFee: pending,
    developmentFund: pending,
    securityCharges: pending,
  },
];

/** Sum of every recorded `amount` across all fees and houses — "how much
 * the RWA has actually collected so far." Not currently surfaced in the UI
 * (per-record amounts aren't tracked yet), kept for when they are. */
export function computeTotalCollected(records: MembershipRecord[]): number {
  return records.reduce((total, record) => {
    const fees = [
      record.registrationFee,
      record.developmentFund,
      record.securityCharges,
    ];
    return (
      total +
      fees.reduce(
        (sum, fee) => sum + (fee.status === "PAID" ? (fee.amount ?? 0) : 0),
        0,
      )
    );
  }, 0);
}

export function formatRupees(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}
