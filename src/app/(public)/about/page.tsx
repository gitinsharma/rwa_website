import type { Metadata } from "next";
import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import {
  formatIndianPhone,
  GENERAL_INQUIRY_EMAIL,
  OFFICE_BEARERS,
  SECURITY_CONTACTS,
} from "@/lib/contacts";

export const metadata: Metadata = {
  title: "About & Contact",
  description:
    "Sector 43 RWA governing body, security contacts, and general inquiries.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        About &amp; Contact
      </h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        Sector 43 Residents Welfare Association — current governing body and
        how to reach us.
      </p>

      {/* Governing Body */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          RWA Governing Body
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {OFFICE_BEARERS.map((officer) => (
            <div
              key={officer.role}
              className="rounded-lg border border-slate-200 p-5 dark:border-slate-800"
            >
              <p className="text-xs font-medium tracking-wide text-blue-600 uppercase dark:text-blue-400">
                {officer.role}
              </p>
              <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">
                {officer.name}
              </p>
              <a
                href={`tel:+91${officer.phone}`}
                className="mt-3 flex min-h-11 items-center gap-2 text-sm text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
              >
                <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                {formatIndianPhone(officer.phone)}
              </a>
              {officer.address && (
                <p className="mt-1 flex items-start gap-2 text-sm text-slate-500 dark:text-slate-500">
                  <MapPin
                    className="mt-0.5 h-4 w-4 shrink-0"
                    aria-hidden="true"
                  />
                  {officer.address}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Security Contacts */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Security Contacts
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {SECURITY_CONTACTS.map((contact) => (
            <div
              key={contact.role}
              className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-800"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck
                  className="h-5 w-5 text-blue-600 dark:text-blue-400"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {contact.role}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500">
                    {contact.name}
                  </p>
                </div>
              </div>
              <a
                href={`tel:+91${contact.phone}`}
                className="flex min-h-11 items-center px-2 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                {formatIndianPhone(contact.phone)}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* General Inquiries */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          General Inquiries
        </h2>
        <a
          href={`mailto:${GENERAL_INQUIRY_EMAIL}`}
          className="mt-3 flex min-h-11 w-fit items-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-700 hover:border-blue-300 hover:text-blue-600 dark:border-slate-800 dark:text-slate-300 dark:hover:border-blue-800 dark:hover:text-blue-400"
        >
          <Mail className="h-4 w-4" aria-hidden="true" />
          {GENERAL_INQUIRY_EMAIL}
        </a>
      </section>
    </div>
  );
}
