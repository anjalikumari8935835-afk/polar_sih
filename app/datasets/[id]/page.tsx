import DataChart from "../../../src/components/DataChart";
type Dataset = {
  title: string;
  region: string;
  description: string;
  variables: string[];
  station: string;
};

const datasets: Record<string, Dataset> = {
  maitri: {
    title: "Maitri Station",
    region: "Antarctica",
    station: "Maitri Research Station",
    description:
      "Environmental and atmospheric observations from India's Maitri research station in Antarctica.",
    variables: ["Temperature", "Wind Speed", "Humidity"],
  },

  bharati: {
    title: "Bharati Station",
    region: "Antarctica",
    station: "Bharati Research Station",
    description:
      "Scientific observations and environmental measurements from India's Bharati research station.",
    variables: ["Temperature", "Atmospheric Data", "Weather"],
  },

  himadri: {
    title: "Himadri Station",
    region: "Arctic",
    station: "Himadri Research Station",
    description:
      "Arctic environmental observations and scientific measurements from India's Himadri research station.",
    variables: ["Temperature", "Atmospheric Data"],
  },

  himansh: {
    title: "Himansh Research",
    region: "Himalaya",
    station: "Himansh Research Station",
    description:
      "High-altitude observations and environmental datasets from India's Himalayan research activities.",
    variables: ["Glacial Data", "Weather"],
  },

  "southern-ocean": {
    title: "Southern Ocean",
    region: "Southern Ocean",
    station: "Southern Ocean Research",
    description:
      "Oceanographic observations and measurements collected during Southern Ocean research activities.",
    variables: ["Ocean Data", "Carbon Flux", "Hydrography"],
  },
};

export default async function DatasetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dataset = datasets[id];

  if (!dataset) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold text-slate-900">
            Dataset Not Found
          </h1>

          <p className="mt-4 text-slate-600">
            The requested dataset could not be found.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">

      {/* Header */}
      <section className="bg-slate-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">

          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-400">
            {dataset.region}
          </p>

          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
            {dataset.title}
          </h1>

          <p className="mt-4 text-lg text-slate-400">
            {dataset.station}
          </p>

        </div>
      </section>

      {/* Dataset Information */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">

          <div className="grid gap-8 lg:grid-cols-3">

            {/* Description */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm lg:col-span-2">

              <h2 className="text-2xl font-bold text-slate-900">
                About this dataset
              </h2>

              <p className="mt-4 leading-7 text-slate-600">
                {dataset.description}
              </p>

            </div>

            {/* Metadata */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

              <h2 className="text-xl font-bold text-slate-900">
                Dataset Information
              </h2>

              <div className="mt-6 space-y-4">

                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">
                    Region
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-900">
                    {dataset.region}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">
                    Research Station
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-900">
                    {dataset.station}
                  </p>
                </div>

              </div>

            </div>

          </div>
          {/* Data Overview */}
<div className="mt-8 grid gap-6 md:grid-cols-3">

  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <p className="text-sm text-slate-500">
      Data Records
    </p>

    <p className="mt-2 text-3xl font-bold text-slate-900">
      1,250+
    </p>

    <p className="mt-2 text-sm text-slate-500">
      Sample observations
    </p>
  </div>

  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <p className="text-sm text-slate-500">
      Time Coverage
    </p>

    <p className="mt-2 text-3xl font-bold text-slate-900">
      2020–2025
    </p>

    <p className="mt-2 text-sm text-slate-500">
      Available observation period
    </p>
  </div>

  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <p className="text-sm text-slate-500">
      Data Format
    </p>

    <p className="mt-2 text-3xl font-bold text-slate-900">
      CSV
    </p>

    <p className="mt-2 text-sm text-slate-500">
      Example downloadable format
    </p>
  </div>

</div>

{/* Chart Placeholder */}
<div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

  <h2 className="text-2xl font-bold text-slate-900">
    Environmental Data
  </h2>

  <p className="mt-2 text-sm text-slate-500">
    Visualization of selected environmental observations.
  </p>

  <div className="mt-6 rounded-xl bg-slate-50 p-4">
  <DataChart />
</div>

</div>

          {/* Variables */}
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

            <h2 className="text-2xl font-bold text-slate-900">
              Available Variables
            </h2>

            <div className="mt-6 flex flex-wrap gap-3">

              {dataset.variables.map((variable) => (
                <span
                  key={variable}
                  className="rounded-full bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700"
                >
                  {variable}
                </span>
              ))}

            </div>

          </div>

        </div>
      </section>

    </main>
  );
}