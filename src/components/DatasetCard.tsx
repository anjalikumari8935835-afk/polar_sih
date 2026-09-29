"use client";

import Link from "next/link";

type DatasetCardProps = {
  title: string;
  region: string;
  description: string;
  variables: string;
  href?: string;
};

function downloadFile(format: string, title: string) {
  const fileName = title.toLowerCase().replace(/\s+/g, "-");

  let content = "";
  let mimeType = "";
  let extension = "";

  if (format === "CSV") {
    content =
      "month,temperature,windSpeed,humidity\n" +
      "Jan,-18,18,72\n" +
      "Feb,-21,22,75\n" +
      "Mar,-24,25,78\n" +
      "Apr,-17,19,70\n" +
      "May,-12,16,68\n" +
      "Jun,-8,14,65";

    mimeType = "text/csv";
    extension = "csv";
  }

  if (format === "JSON") {
    content = JSON.stringify(
      [
        {
          month: "Jan",
          temperature: -18,
          windSpeed: 18,
          humidity: 72,
        },
        {
          month: "Feb",
          temperature: -21,
          windSpeed: 22,
          humidity: 75,
        },
        {
          month: "Mar",
          temperature: -24,
          windSpeed: 25,
          humidity: 78,
        },
      ],
      null,
      2
    );

    mimeType = "application/json";
    extension = "json";
  }

  if (format === "NetCDF") {
    alert(
      "NetCDF download will be connected to the real scientific dataset later."
    );
    return;
  }

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName}.${extension}`;
  link.click();

  URL.revokeObjectURL(url);
}

export default function DatasetCard({
  title,
  region,
  description,
  variables,
  href = "/datasets",
}: DatasetCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-sky-200 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-sky-800">

      {/* Top accent */}
      <div className="h-1.5 bg-linear-to-r from-sky-500 via-cyan-400 to-blue-500" />

      <div className="p-6">

        {/* Dataset icon + region */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-2xl dark:bg-sky-950">
            ❄️
          </div>

          <span className="rounded-full bg-sky-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-sky-700 dark:bg-sky-950 dark:text-sky-300">
            {region}
          </span>
        </div>

        {/* Title */}
        <h3 className="mt-5 text-xl font-bold text-slate-900 transition-colors group-hover:text-sky-600 dark:text-white dark:group-hover:text-sky-400">
          {title}
        </h3>

        {/* Description */}
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
          {description}
        </p>

        {/* Variables */}
        <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-sky-500" />

            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Available variables
            </p>
          </div>

          <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
            {variables}
          </p>
        </div>

        {/* View Dataset */}
        <Link
          href={href}
          className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-sky-700 hover:shadow-lg hover:shadow-sky-200 dark:hover:shadow-sky-950"
        >
          View Dataset
          <span className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </Link>

        {/* Download buttons */}
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Download
          </p>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => downloadFile("CSV", title)}
              className="rounded-xl border border-slate-200 bg-white px-2 py-2.5 text-xs font-bold text-slate-600 transition-all hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-sky-700 dark:hover:bg-sky-950 dark:hover:text-sky-300"
            >
              CSV
            </button>

            <button
              type="button"
              onClick={() => downloadFile("JSON", title)}
              className="rounded-xl border border-slate-200 bg-white px-2 py-2.5 text-xs font-bold text-slate-600 transition-all hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-sky-700 dark:hover:bg-sky-950 dark:hover:text-sky-300"
            >
              JSON
            </button>

            <button
              type="button"
              onClick={() => downloadFile("NetCDF", title)}
              className="rounded-xl border border-slate-200 bg-white px-2 py-2.5 text-xs font-bold text-slate-600 transition-all hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-sky-700 dark:hover:bg-sky-950 dark:hover:text-sky-300"
            >
              NetCDF
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}