/**
 * Static RWA directory content for the `/about` page. Not modeled in
 * Postgres — office-bearer turnover is infrequent enough (annual/biennial
 * elections) that a code change + redeploy is an acceptable update path for
 * V1, matching 05-public-ui.md's "static, low-churn" framing for this page.
 * Edit this file directly when contacts change; source: contacts_data.md.
 */

export type OfficeBearer = {
  role: string;
  name: string;
  phone: string; // digits only, no spaces — formatted for display at render time
  address?: string;
};

export type SecurityContact = {
  role: string;
  name: string;
  phone: string;
};

export const OFFICE_BEARERS: OfficeBearer[] = [
  {
    role: "President",
    name: "Deepak Sharma",
    phone: "9891390993",
    address: "A-162, Sector 43, Noida",
  },
  {
    role: "General Secretary",
    name: "Yogesh Shandilya",
    phone: "9999964477",
    address: "A-243, Sector 43, Noida",
  },
  {
    role: "Treasurer",
    name: "Chandani Mathur",
    phone: "9312831959",
    address: "A-171, Sector 43, Noida",
  },
];

export const SECURITY_CONTACTS: SecurityContact[] = [
  { role: "Security In-charge (Day)", name: "Ravi", phone: "7859004004" },
  { role: "Security In-charge (Night)", name: "Sunil", phone: "8010888666" },
];

export const GENERAL_INQUIRY_EMAIL = "rwa43Noida@gmail.com";

/** "9891390993" -> "+91 98913 90993" for display. */
export function formatIndianPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length !== 10) return phone;
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
}
