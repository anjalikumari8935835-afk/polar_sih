"use client";


import { useState } from "react";

const categories = [
  "All",
  "Research",
  "Expedition",
  "Science",
  "Announcements",
];

const newsItems = [
  {
    id: 1,
    category: "Research",
    title: "New Polar Research Activities",
    date: "24 September 2025",
    description:
      "Explore recent scientific activities, observations and research connected with India's polar science programmes.",
    featured: true,
  },
  {
    id: 2,
    category: "Expedition",
    title: "Southern Ocean Research Expedition",
    date: "18 September 2025",
    description:
      "Learn about oceanographic observations and environmental measurements collected during Southern Ocean research.",
    featured: false,
  },
  {
    id: 3,
    category: "Science",
    title: "Understanding Polar Observations",
    date: "12 September 2025",
    description:
      "Discover how scientific observations help researchers understand changing polar environments.",
    featured: false,
  },
  {
    id: 4,
    category: "Announcements",
    title: "Polar Science Portal Update",
    date: "05 September 2025",
    description:
      "Explore new resources, datasets, visualizations and educational experiences available through the portal.",
    featured: false,
  },
  {
    id: 5,
    category: "Research",
    title: "Antarctic Station Observations",
    date: "28 August 2025",
    description:
      "Explore environmental measurements and scientific observations from Indian Antarctic research stations.",
    featured: false,
  },
  {
    id: 6,
    category: "Science",
    title: "Polar Science for Students",
    date: "20 August 2025",
    description:
      "Discover educational resources designed to introduce students to polar environments and scientific research.",
    featured: false,
  },
];

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedNews, setSelectedNews] =
    useState<(typeof newsItems)[number] | null>(null);

  const filteredNews =
    activeCategory === "All"
      ? newsItems
      : newsItems.filter(
          (item) => item.category === activeCategory
        );

  const featuredNews = newsItems.find((item) => item.featured);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_20%,rgba(14,165,233,0.2),transparent_36%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="max-w-4xl">
            <div className="flex flex-wrap gap-3">
              <span className="rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sky-300">
                Polar Science News
              </span>

              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400">
                Research • Expeditions • Science
              </span>
            </div>

            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              The Polar World Still Changing.
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
              Stay close to the discoveries, expeditions and scientific developments happening now.
            </p>
          </div>
        </div>
      </section>

      {/* Featured story */}
      {featuredNews && (
        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="overflow-hidden rounded-3xl bg-slate-900 shadow-xl">
            <div className="grid lg:grid-cols-2">
              <div className="flex min-h-80 items-center justify-center bg-linear-to-br from-sky-900 via-slate-900 to-slate-950 p-10">
                <div className="text-center">
                  <div className="text-7xl">❄️</div>

                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.25em] text-sky-300">
                    Featured Story
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-center p-8 sm:p-10">
                <span className="w-fit rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sky-300">
                  {featuredNews.category}
                </span>

                <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
                  {featuredNews.title}
                </h2>

                <p className="mt-4 text-sm text-slate-400">
                  {featuredNews.date}
                </p>

                <p className="mt-5 leading-7 text-slate-300">
                  {featuredNews.description}
                </p>

                <button
                  type="button"
                  onClick={() => setSelectedNews(featuredNews)}
                  className="mt-7 w-fit rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-400"
                >
                  Read Story →
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* News directory */}
      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">
              News Archive
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
              Explore Updates
            </h2>

            <p className="mt-3 max-w-2xl text-slate-500 dark:text-slate-400">
              Browse news and updates across different areas of polar science.
            </p>
          </div>

          <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
            {filteredNews.length} stories
          </span>
        </div>

        {/* Filters */}
        <div className="mt-7 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                activeCategory === category
                  ? "bg-sky-600 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-sky-600 dark:hover:text-sky-400"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* News cards */}
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredNews.map((item) => (
            <article
              key={item.id}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:hover:border-sky-800"
            >
              <div className="flex h-40 items-center justify-center bg-linear-to-br from-sky-50 via-slate-50 to-slate-100 text-5xl dark:from-sky-950 dark:via-slate-900 dark:to-slate-800">
                {item.category === "Expedition"
                  ? "🧭"
                  : item.category === "Research"
                    ? "🔬"
                    : item.category === "Announcements"
                      ? "📢"
                      : "🌍"}
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-sky-600">
                    {item.category}
                  </span>

                  <span className="text-xs text-slate-400">
                    {item.date}
                  </span>
                </div>

                <h3 className="mt-3 text-xl font-bold text-slate-900 group-hover:text-sky-700 dark:text-white dark:group-hover:text-sky-400">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {item.description}
                </p>

                <button
                  type="button"
                  onClick={() => setSelectedNews(item)}
                  className="mt-5 text-sm font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
                >
                  Read More →
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* News + portal CTA */}
      <section className="bg-white dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            <a
              href="/datasets"
              className="rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:border-sky-200 hover:bg-white hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-sky-800 dark:hover:bg-slate-800"
            >
              <span className="text-3xl">🗂️</span>

              <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
                Research Data
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Explore datasets connected with polar observations and
                research.
              </p>

              <span className="mt-5 block text-sm font-semibold text-sky-600 dark:text-sky-400">
                Browse datasets →
              </span>
            </a>

            <a
              href="/visualization"
              className="rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:border-sky-200 hover:bg-white hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-sky-800 dark:hover:bg-slate-800"
            >
              <span className="text-3xl">📈</span>

              <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
                Data Visualization
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Explore environmental observations through interactive
                visualizations.
              </p>

              <span className="mt-5 block text-sm font-semibold text-sky-600 dark:text-sky-400">
                Explore visualization →
              </span>
            </a>

            <a
              href="/outreach"
              className="rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:border-sky-200 hover:bg-white hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-sky-800 dark:hover:bg-slate-800"
            >
              <span className="text-3xl">📚</span>

              <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
                Science Outreach
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Discover accessible stories and resources about polar science.
              </p>

              <span className="mt-5 block text-sm font-semibold text-sky-600 dark:text-sky-400">
                Explore outreach →
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-6">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl dark:bg-slate-900">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-sky-600">
                  {selectedNews.category}
                </span>

                <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                  {selectedNews.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedNews(null)}
                className="rounded-lg px-3 py-2 text-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <p className="mt-3 text-sm text-slate-400">
              {selectedNews.date}
            </p>

            <p className="mt-6 leading-7 text-slate-600 dark:text-slate-300">
              {selectedNews.description}
            </p>

            <div className="mt-7 rounded-xl border border-sky-100 bg-sky-50 p-5 dark:border-sky-900 dark:bg-sky-950">
              <p className="text-sm font-semibold text-sky-800 dark:text-sky-300">
                News story
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                This prototype provides the news discovery interface. Full
                article content can be connected here when the final content
                source is available.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedNews(null)}
              className="mt-7 rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}