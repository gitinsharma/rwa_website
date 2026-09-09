import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/notices", label: "Notices" },
  { href: "/meetings", label: "Meeting Minutes" },
  { href: "/documents", label: "Documents" },
  { href: "/authority", label: "Authority Correspondence" },
  { href: "/about", label: "About & Contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 sm:px-6">
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600 dark:text-slate-400">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-blue-600 dark:hover:text-blue-400">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex flex-col gap-1 text-xs text-slate-500 dark:text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} Sector 43 Residents Welfare
            Association, Noida. Official inquiries:{" "}
            <a
              href="mailto:info@sector43rwa.in"
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              info@sector43rwa.in
            </a>
          </p>
          <p>
            This site is an informational archive for Sector 43 residents and
            does not process payments, complaints, or resident accounts.
          </p>
        </div>
      </div>
    </footer>
  );
}
