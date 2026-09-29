"use client";

import { useMemo, useState } from "react";

const regions = [
  "All Regions",
  "Antarctica",
  "Arctic",
  "Himalaya",
  "Southern Ocean",
];

const variables = [
  "Temperature",
  "Wind Speed",
  "Humidity",
  "Carbon Flux",
  "Hydrography",
];

const years = ["2023", "2024", "2025"];

const datasets = [
  {
    name: "Maitri Station",
    region: "Antarctica",
    station: "Maitri Research Station",
    latitude: "-70.76° S",
    longitude: "11.73° E",
    temperature: -18,
    windSpeed: 18,
    humidity: 72,
    carbonFlux: 1.4,
    hydrography: 28,
  },
  {
    name: "Bharati Station",
    region: "Antarctica",
    station: "Bharati Research Station",
    latitude: "-69.40° S",
    longitude: "76.19° E",
    temperature: -14,
    windSpeed: 21,
    humidity: 75,
    carbonFlux: 1.7,
    hydrography: 31,
  },
  {
    name: "Himadri Station",
    region: "Arctic",
    station: "Himadri Research Station",
    latitude: "78.92° N",
    longitude: "11.93° E",
    temperature: -12,
    windSpeed: 11,
    humidity: 68,
    carbonFlux: 0.9,
    hydrography: 19,
  },
  {
    name: "Himansh Research",
    region: "Himalaya",
    station: "Himansh Research Site",
    latitude: "32.50° N",
    longitude: "77.00° E",
    temperature: -6,
    windSpeed: 8,
    humidity: 61,
    carbonFlux: 0.6,
    hydrography: 12,
  },
  {
    name: "Southern Ocean",
    region: "Southern Ocean",
    station: "Ocean Research Survey",
    latitude: "60.00° S",
    longitude: "45.00° E",
    temperature: -2,
    windSpeed: 15,
    humidity: 80,
    carbonFlux: 1.8,
    hydrography: 34,
  },
];

const variableInfo: Record<
  string,
  {
    key: string;
    unit: string;
    description: string;
  }
> = {
  Temperature: {
    key: "temperature",
    unit: "°C",
    description: "Air temperature",
  },
  "Wind Speed": {
    key: "windSpeed",
    unit: "m/s",
    description: "Wind speed",
  },
  Humidity: {
    key: "humidity",
    unit: "%",
    description: "Relative humidity",
  },
  "Carbon Flux": {
    key: "carbonFlux",
    unit: "mmol/m²/day",
    description: "Carbon flux",
  },
  Hydrography: {
    key: "hydrography",
    unit: "units",
    description: "Hydrographic measurement",
  },
};

const monthlyLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

export default function VisualizationPage() {
  const [region, setRegion] = useState("All Regions");
  const [variable, setVariable] = useState("Temperature");
  const [year, setYear] = useState("2025");
  const [selectedDataset, setSelectedDataset] =
    useState("Maitri Station");

  const filteredDatasets = useMemo(() => {
    if (region === "All Regions") return datasets;

    return datasets.filter(
      (dataset) => dataset.region === region
    );
  }, [region]);

  const selected =
    datasets.find(
      (dataset) => dataset.name === selectedDataset
    ) ?? datasets[0];

  const currentVariable = variableInfo[variable];

  const selectedValue =
    selected[
      currentVariable.key as keyof typeof selected
    ];

  const trendValues = [
    Number(selectedValue),
    Number(selectedValue) + 3,
    Number(selectedValue) - 2,
    Number(selectedValue) + 5,
    Number(selectedValue) + 1,
    Number(selectedValue) + 4,
  ];

  const maxTrend = Math.max(
    ...trendValues.map((value) => Math.abs(value)),
    1
  );

  const handleRegionChange = (newRegion: string) => {
    setRegion(newRegion);

    if (newRegion === "All Regions") {
      setSelectedDataset("Maitri Station");
      return;
    }

    const firstDataset = datasets.find(
      (dataset) => dataset.region === newRegion
    );

    if (firstDataset) {
      setSelectedDataset(firstDataset.name);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
       <div className="mx-auto max-w-7xl px-6 pt-6">
    
  </div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(14,165,233,0.18),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sky-300">
                Scientific Visualization
              </span>

              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400">
                Interactive Explorer
              </span>
            </div>

            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Make The Invisible Visible
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
              Turn polar data into patterns you can see, explore and understand.
            </p>
          </div>
        </div>
      </section>

      {/* Dashboard */}
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        {/* Filter panel */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">
                Data Controls
              </p>

              <h2 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
                Configure your view
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {variables.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setVariable(item)}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    variable === item
                      ? "bg-sky-600 text-white"
                      : "border border-slate-200 bg-slate-50 text-slate-600 hover:border-sky-300 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-sky-600 dark:hover:text-sky-400"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Region
              </label>

              <select
                value={region}
                onChange={(event) =>
                  handleRegionChange(event.target.value)
                }
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              >
                {regions.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Variable
              </label>

              <select
                value={variable}
                onChange={(event) =>
                  setVariable(event.target.value)
                }
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              >
                {variables.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Observation Year
              </label>

              <select
                value={year}
                onChange={(event) =>
                  setYear(event.target.value)
                }
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              >
                {years.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Dataset selector */}
        <section className="mt-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">
                Observation Sites
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                Select a research site
              </h2>
            </div>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
              {filteredDatasets.length} sites
            </span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {filteredDatasets.map((dataset) => (
              <button
                key={dataset.name}
                type="button"
                onClick={() =>
                  setSelectedDataset(dataset.name)
                }
                className={`rounded-2xl border p-4 text-left transition ${
                  selectedDataset === dataset.name
                    ? "border-sky-400 bg-sky-50 shadow-sm dark:border-sky-500 dark:bg-sky-950"
                    : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:hover:border-sky-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">
                    {dataset.region === "Southern Ocean"
                      ? "🌊"
                      : dataset.region === "Himalaya"
                        ? "🏔️"
                        : dataset.region === "Arctic"
                          ? "🧊"
                          : "❄️"}
                  </span>

                  {selectedDataset === dataset.name && (
                    <span className="h-2 w-2 rounded-full bg-sky-500" />
                  )}
                </div>

                <p className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
                  {dataset.name}
                </p>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {dataset.region}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* Main dashboard */}
        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          {/* Map */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900 lg:col-span-7">
            <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-slate-800">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">
                  Spatial View
                </p>

                <h2 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
                  Observation Location
                </h2>
              </div>

              <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                Active Site
              </span>
            </div>

            <div className="relative h-90 overflow-hidden bg-slate-900">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.12),transparent_45%)]" />

              bg-[linear-gradient(rgba(148,163,184,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.2)_1px,transparent_1px)]
              {/* Latitude lines */}
              <div className="absolute left-0 right-0 top-1/4 border-t border-dashed border-slate-600/50" />
              <div className="absolute left-0 right-0 top-1/2 border-t border-dashed border-slate-600/50" />
              <div className="absolute left-0 right-0 top-3/4 border-t border-dashed border-slate-600/50" />

              {/* Location */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sky-500/10">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/20">
                    <div className="h-4 w-4 rounded-full bg-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.9)]" />
                  </div>
                </div>

                <div className="mt-2 whitespace-nowrap rounded-xl border border-white/10 bg-slate-950/90 px-4 py-3 text-center shadow-xl">
                  <p className="text-sm font-bold text-white">
                    {selected.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {selected.latitude} • {selected.longitude}
                  </p>
                </div>
              </div>

              <div className="absolute bottom-4 left-4 rounded-lg bg-slate-950/80 px-3 py-2 text-xs text-slate-300">
                Polar observation map
              </div>

              <div className="absolute right-4 top-4 rounded-full border border-amber-300/20 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
                Sample observation
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-4">
              <div>
                <p className="text-xs text-slate-400">Station</p>
                <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {selected.name}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">Region</p>
                <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {selected.region}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">Latitude</p>
                <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {selected.latitude}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">Longitude</p>
                <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {selected.longitude}
                </p>
              </div>
            </div>
          </section>

          {/* Current value */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">
              Selected Observation
            </p>

            <div className="mt-2 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {variable}
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {selected.name}
                </p>
              </div>

              <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                {year}
              </span>
            </div>

            <div className="mt-10">
              <div className="flex items-baseline gap-3">
                <span className="text-6xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {selectedValue}
                </span>

                <span className="text-lg font-semibold text-sky-600 dark:text-sky-400">
                  {currentVariable.unit}
                </span>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">
                {currentVariable.description} recorded at{" "}
                {selected.station}.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
                <p className="text-xs text-slate-400">
                  Observation period
                </p>

                <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200">
                  {year}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
                <p className="text-xs text-slate-400">
                  Data source
                </p>

                <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200">
                  {selected.name}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-sky-100 bg-sky-50 p-4 dark:border-sky-900 dark:bg-sky-950">
              <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">
                Current variable
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
                {variable} ({currentVariable.unit})
              </p>
            </div>
          </section>
        </div>

        {/* Environmental metrics */}
        <section className="mt-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">
              Environmental Snapshot
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
              Site Conditions
            </h2>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              label="Temperature"
              value={`${selected.temperature}°C`}
              icon="🌡️"
            />

            <MetricCard
              label="Wind Speed"
              value={`${selected.windSpeed} m/s`}
              icon="💨"
            />

            <MetricCard
              label="Humidity"
              value={`${selected.humidity}%`}
              icon="💧"
            />

            <MetricCard
              label="Carbon Flux"
              value={`${selected.carbonFlux}`}
              icon="🌍"
            />
          </div>
        </section>

        {/* Trend */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">
                Temporal Analysis
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                {variable} Trend
              </h2>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Monthly observation pattern for {selected.name} in {year}.
              </p>
            </div>

            <div className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
              Jan — Jun
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-slate-50 p-5 dark:bg-slate-800">
            <div className="flex h-72 items-end gap-3 sm:gap-5">
              {trendValues.map((value, index) => {
                const height = Math.max(
                  (Math.abs(value) / maxTrend) * 100,
                  12
                );

                return (
                  <div
                    key={monthlyLabels[index]}
                    className="flex h-full flex-1 flex-col justify-end"
                  >
                    <div className="mb-2 text-center text-xs font-semibold text-slate-500 dark:text-slate-300">
                      {value}
                    </div>

                    <div
                      className="w-full rounded-t-xl bg-sky-500 transition-all duration-500 hover:bg-sky-400"
                      style={{ height: `${height}%` }}
                    />

                    <p className="mt-3 text-center text-xs font-medium text-slate-400">
                      {monthlyLabels[index]}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Available variables */}
        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">
              Variables
            </p>

            <h2 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
              Available Measurements
            </h2>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {variables.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setVariable(item)}
                  className={`rounded-xl p-4 text-left text-sm font-semibold transition ${
                    variable === item
                      ? "bg-sky-600 text-white"
                      : "bg-slate-50 text-slate-700 hover:bg-sky-50 hover:text-sky-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-sky-950 dark:hover:text-sky-300"
                  }`}
                >
                  {item}

                  <span
                    className={`mt-1 block text-xs font-normal ${
                      variable === item
                        ? "text-sky-100"
                        : "text-slate-400"
                    }`}
                  >
                    {variableInfo[item].unit}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">
              Observation Metadata
            </p>

            <h2 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
              Dataset Information
            </h2>

            <div className="mt-5 space-y-4">
              <InfoRow
                label="Observation site"
                value={selected.station}
              />

              <InfoRow
                label="Region"
                value={selected.region}
              />

              <InfoRow
                label="Coordinates"
                value={`${selected.latitude}, ${selected.longitude}`}
              />

              <InfoRow
                label="Selected year"
                value={year}
              />

              <InfoRow
                label="Selected variable"
                value={`${variable} (${currentVariable.unit})`}
              />
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

function MetricCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>

        <span className="h-2 w-2 rounded-full bg-sky-500" />
      </div>

      <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">{label}</p>

      <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-slate-100 pb-3 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>

      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 sm:text-right">
        {value}
      </span>
    </div>
  );
}