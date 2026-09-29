"use client";
  

import Link from "next/link";
import { useMemo, useState } from "react";

const regions = [
  "All Regions",
  "Antarctica",
  "Arctic",
  "Himalaya",
  "Southern Ocean",
];

const datasets = [
  {
    id: "maitri",
    title: "Maitri Station",
    region: "Antarctica",
    type: "Station Observations",
    description:
      "Environmental and atmospheric observations from India's Maitri research station.",
    variables: ["Temperature", "Wind Speed", "Humidity"],
    period: "2020–2025",
  },
  {
    id: "bharati",
    title: "Bharati Station",
    region: "Antarctica",
    type: "Station Observations",
    description:
      "Scientific observations and environmental measurements from India's Bharati research station.",
    variables: ["Temperature", "Atmospheric Data", "Weather"],
    period: "2020–2025",
  },
  {
    id: "himadri",
    title: "Himadri Station",
    region: "Arctic",
    type: "Station Observations",
    description:
      "Arctic environmental observations and scientific measurements from the Himadri research station.",
    variables: ["Temperature", "Atmospheric Data"],
    period: "2020–2025",
  },
  {
    id: "himansh",
    title: "Himansh Research",
    region: "Himalaya",
    type: "Environmental Research",
    description:
      "High-altitude observations and environmental datasets from India's Himalayan research activities.",
    variables: ["Glacial Data", "Weather"],
    period: "2020–2025",
  },
  {
    id: "southern-ocean",
    title: "Southern Ocean",
    region: "Southern Ocean",
    type: "Oceanographic Data",
    description:
      "Oceanographic observations and measurements collected during Southern Ocean research activities.",
    variables: ["Ocean Data", "Carbon Flux", "Hydrography"],
    period: "2020–2025",
  },
];

export default function DatasetsPage() {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("All Regions");

  const filteredDatasets = useMemo(() => {
    return datasets.filter((dataset) => {
      const matchesRegion =
        region === "All Regions" || dataset.region === region;

      const searchText = search.toLowerCase();

      const matchesSearch =
        dataset.title.toLowerCase().includes(searchText) ||
        dataset.region.toLowerCase().includes(searchText) ||
        dataset.type.toLowerCase().includes(searchText) ||
        dataset.variables.some((variable) =>
          variable.toLowerCase().includes(searchText)
        );

      return matchesRegion && matchesSearch;
    });
  }, [search, region]);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-400">
            Scientific Data Repository
          </p>

          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
            Evidence Beneath The Surface
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            Find the measurements behind are understanding of the polar world.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-2xl font-bold">180+</p>
              <p className="mt-1 text-sm text-slate-400">
                Scientific Datasets
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-2xl font-bold">4</p>
              <p className="mt-1 text-sm text-slate-400">
                Polar Regions
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-2xl font-bold">CSV • JSON</p>
              <p className="mt-1 text-sm text-slate-400">
                Demo Download Formats
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Repository */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Search and filter */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <label
                htmlFor="dataset-search"
                className="text-sm font-semibold text-slate-700"
              >
                Search datasets
              </label>

              <div className="relative mt-2">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  🔎
                </span>

                <input
                  id="dataset-search"
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by dataset, region or variable..."
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="region-filter"
                className="text-sm font-semibold text-slate-700"
              >
                Region
              </label>

              <select
                id="region-filter"
                value={region}
                onChange={(event) => setRegion(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-sky-500 lg:w-56"
              >
                {regions.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {regions.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setRegion(item)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  region === item
                    ? "bg-sky-600 text-white"
                    : "border border-slate-200 bg-slate-50 text-slate-600 hover:border-sky-300 hover:text-sky-600"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Result count */}
        <div className="mt-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-sky-600">
              Repository
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              Available Datasets
            </h2>
          </div>

          <p className="text-sm text-slate-500">
            {filteredDatasets.length} result
            {filteredDatasets.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Dataset cards */}
        {filteredDatasets.length > 0 ? (
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {filteredDatasets.map((dataset) => (
              <article
                key={dataset.id}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                      {dataset.region}
                    </span>

                    <h3 className="mt-4 text-2xl font-bold text-slate-900 group-hover:text-sky-700">
                      {dataset.title}
                    </h3>

                    <p className="mt-1 text-sm font-medium text-slate-400">
                      {dataset.type}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-100 p-3 text-xl">
                    {dataset.region === "Southern Ocean"
                      ? "🌊"
                      : dataset.region === "Himalaya"
                        ? "🏔️"
                        : dataset.region === "Arctic"
                          ? "🧊"
                          : "❄️"}
                  </div>
                </div>

                <p className="mt-5 text-sm leading-6 text-slate-600">
                  {dataset.description}
                </p>

                <div className="mt-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Available Variables
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {dataset.variables.map((variable) => (
                      <span
                        key={variable}
                        className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600"
                      >
                        {variable}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                  <div>
                    <p className="text-xs text-slate-400">
                      Data period
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {dataset.period}
                    </p>
                  </div>

                  <Link
                    href={`/datasets/${dataset.id}`}
                    className="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700"
                  >
                    View Dataset →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <div className="text-4xl">🔎</div>

            <h3 className="mt-4 text-xl font-bold text-slate-900">
              No datasets found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try another search term or select a different region.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setRegion("All Regions");
              }}
              className="mt-5 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-700"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Demo notice */}
        <div className="mt-12 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm leading-6 text-amber-800">
            <span className="font-semibold">Frontend demonstration:</span>{" "}
            The dataset records and values shown here are demonstration data
            for interface development. Production datasets will be provided
            and managed by the designated data management team.
          </p>
        </div>
      </section>
    </main>
  );
}