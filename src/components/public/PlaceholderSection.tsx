import type { LucideIcon } from "lucide-react";

type PlaceholderSectionProps = {
  title: string;
  description: string;
  icon: LucideIcon;
};

/** Interim content for public routes whose full spec (data model, layout)
 * hasn't been implemented yet — keeps nav links honest instead of 404ing. */
export function PlaceholderSection({
  title,
  description,
  icon: Icon,
}: PlaceholderSectionProps) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        {title}
      </h1>
      <div className="mt-8 flex flex-col items-center gap-3 rounded-lg border border-dashed border-slate-300 px-6 py-12 text-center dark:border-slate-700">
        <Icon className="h-8 w-8 text-slate-400" aria-hidden="true" />
        <p className="max-w-md text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
    </section>
  );
}
