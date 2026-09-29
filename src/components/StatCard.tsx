type StatCardProps = {
  value: string;
  label: string;
  description?: string;
};

export default function StatCard({
  value,
  label,
  description,
}: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-sky-800">

      {/* Background decoration */}
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-sky-50 transition-transform duration-500 group-hover:scale-150 dark:bg-sky-950" />

      <div className="relative">

        {/* Icon */}
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-xl dark:bg-sky-950">
          ✦
        </div>

        {/* Value */}
        <div className="mt-5 text-3xl font-extrabold tracking-tight text-sky-600 dark:text-sky-400">
          {value}
        </div>

        {/* Label */}
        <div className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
          {label}
        </div>

        {/* Description */}
        {description && (
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            {description}
          </p>
        )}

        {/* Bottom accent */}
        <div className="mt-5 h-1 w-12 rounded-full bg-sky-500 transition-all duration-300 group-hover:w-20" />
      </div>
    </div>
  );
}