import Link from "next/link";

type RegionCardProps = {
  title: string;
  subtitle: string;
  description: string;
  href?: string;
};

export default function RegionCard({
  title,
  subtitle,
  description,
  href = "#",
}: RegionCardProps) {
  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-sky-200 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-sky-800"
    >
      {/* Decorative gradient */}
      <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-sky-50 opacity-70 blur-2xl transition-all duration-500 group-hover:scale-150 dark:bg-sky-950" />

      <div className="relative">

        {/* Region icon */}
        <div className="flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-2xl dark:bg-sky-950">
            🧊
          </div>

          <span className="text-2xl text-slate-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-sky-500">
            →
          </span>
        </div>

        {/* Subtitle */}
        <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-sky-600 dark:text-sky-400">
          {subtitle}
        </p>

        {/* Title */}
        <h3 className="mt-2 text-2xl font-bold text-slate-900 transition-colors group-hover:text-sky-600 dark:text-white dark:group-hover:text-sky-400">
          {title}
        </h3>

        {/* Description */}
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
          {description}
        </p>

        {/* Explore */}
        <div className="mt-6 flex items-center gap-2 text-sm font-bold text-sky-600 dark:text-sky-400">
          <span>Explore region</span>

          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}