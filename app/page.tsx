import Link from "next/link";
import StatCard from "../src/components/StatCard";

const regions = [
  {
    title: "Antarctica",
    subtitle: "Maitri • Bharati",
    description:
      "Explore environmental observations, atmospheric measurements and scientific activities from India's Antarctic research stations.",
    href: "/datasets",
    csv: "/downloads/antarctica.csv",
    json: "/downloads/antarctica.json",
    netcdf: "/downloads/antarctica.nc",
    icon: "🧊",
  },
  {
    title: "Arctic",
    subtitle: "Himadri",
    description:
      "Discover Arctic observations and research activities from India's Himadri research station.",
    href: "/datasets/himadri",
    csv: "/downloads/arctic.csv",
    json: "/downloads/arctic.json",
    netcdf: "/downloads/arctic.nc",
    icon: "❄️",
  },
  {
    title: "Himalaya",
    subtitle: "Himansh",
    description:
      "Explore high-altitude environmental observations and Himalayan research activities.",
    href: "/datasets/himansh",
    csv: "/downloads/himalaya.csv",
    json: "/downloads/himalaya.json",
    netcdf: "/downloads/himalaya.nc",
    icon: "🏔️",
  },
  {
    title: "Southern Ocean",
    subtitle: "Ocean Research",
    description:
      "Explore oceanographic observations including hydrography, carbon flux and environmental measurements.",
    href: "/datasets/southern-ocean",
    csv: "/downloads/southern-ocean.csv",
    json: "/downloads/southern-ocean.json",
    netcdf: "/downloads/southern-ocean.nc",
    icon: "🌊",
  },
];

export default function HomePage() {
  return (
    <div className="bg-slate-50 dark:bg-slate-950">
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.22),transparent_35%)]" />
          <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source
            src="/videos/home-background.mp4"
            type="video/mp4"
          />
        </video>
        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="max-w-4xl">
            <div className="inline-flex items-center rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-sm font-medium text-sky-300">
              India&apos;s Polar Research Portal
            </div>

            <h1 className="mt-7 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-7xl">
              The Poles, 
              <span className="block text-sky-400">
                Connected
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              One place for the knowledge, people and stories shaping polar science.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/datasets"
                className="rounded-xl bg-sky-500 px-6 py-3.5 text-center text-sm font-semibold text-white shadow-lg shadow-sky-950/30 hover:bg-sky-400"
              >
                Explore Datasets
              </Link>

              <Link
                href="/visualization"
                className="rounded-xl border border-slate-600 bg-white/5 px-6 py-3.5 text-center text-sm font-semibold text-white hover:bg-white/10"
              >
                Explore Visualization
              </Link>
            </div>
          </div>

          <div className="mt-16 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <p className="text-2xl">🧊</p>
              <p className="mt-3 text-sm font-semibold">Polar Regions</p>
              <p className="mt-1 text-xs leading-5 text-slate-400">
                Antarctica, Arctic, Himalaya and Southern Ocean
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <p className="text-2xl">📊</p>
              <p className="mt-3 text-sm font-semibold">Scientific Data</p>
              <p className="mt-1 text-xs leading-5 text-slate-400">
                Explore datasets and environmental observations
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <p className="text-2xl">🔬</p>
              <p className="mt-3 text-sm font-semibold">
                Research & Knowledge
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-400">
                Connect research, education and collaboration
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              value="42+"
              label="Polar Expeditions"
              description="Research activities across polar regions."
            />
            <StatCard
              value="180+"
              label="Scientific Datasets"
              description="Environmental and scientific observations."
            />
            <StatCard
              value="320+"
              label="Publications"
              description="Research and scientific knowledge resources."
            />
            <StatCard
              value="28+"
              label="Research Programs"
              description="Programs supporting polar science activities."
            />
          </div>
        </div>
      </section>

      <section className="bg-slate-50 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600 dark:text-sky-400">
              Explore Regions
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              India&apos;s Polar Research Footprint
            </h2>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              Explore research activities and environmental observations across
              the major regions represented in the portal.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {regions.map((region) => (
              <div
                key={region.title}
                className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-sky-700"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-3xl dark:bg-sky-950">
                    {region.icon}
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {region.title}
                    </h3>

                    <p className="mt-1 text-sm font-medium text-sky-600 dark:text-sky-400">
                      {region.subtitle}
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {region.description}
                </p>

                <div className="mt-6 border-t border-slate-200 pt-5 dark:border-slate-800">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Dataset Access
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={region.href}
                      className="rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700"
                    >
                      View Dataset
                    </Link>

                    <a
                      href={region.csv}
                      download
                      className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 transition hover:border-sky-400 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
                    >
                      CSV
                    </a>

                    <a
                      href={region.json}
                      download
                      className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 transition hover:border-sky-400 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
                    >
                      JSON
                    </a>

                    <a
                      href={region.netcdf}
                      download
                      className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 transition hover:border-sky-400 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
                    >
                      NetCDF
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="rounded-3xl bg-slate-900 p-8 text-white sm:p-12">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-400">
                One Scientific Platform
              </p>

              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Research, data and knowledge in one place.
              </h2>

              <p className="mt-5 leading-7 text-slate-300">
                The portal brings together scientific datasets,
                visualization, outreach, education, career opportunities,
                collaboration and news.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["📊", "Datasets", "/datasets"],
                ["🗺️", "Visualization", "/visualization"],
                ["📚", "Education", "/education"],
                ["🤝", "Collaboration", "/collaboration"],
              ].map(([icon, title, href]) => (
                <Link
                  key={title}
                  href={href}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10"
                >
                  <span className="text-2xl">{icon}</span>
                  <p className="mt-3 font-semibold">{title}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Explore section →
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600 dark:text-sky-400">
            Explore the Portal
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
            Discover the science behind the polar regions.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-600 dark:text-slate-400">
            Explore datasets, research, educational resources and the latest
            developments in India&apos;s polar science community.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/datasets"
              className="rounded-xl bg-sky-600 px-6 py-3 font-semibold text-white hover:bg-sky-700"
            >
              Explore Datasets
            </Link>

            <Link
              href="/outreach"
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:border-sky-400 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-sky-500 dark:hover:text-sky-400"
            >
              Explore Outreach
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}