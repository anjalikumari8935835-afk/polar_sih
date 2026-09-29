"use client";
import BackButton from "../../src/components/BackButton";

import { useState } from "react";

const opportunities = [
  {
    id: 1,
    type: "Research",
    title: "Polar Research Opportunities",
    organization: "Polar Science Community",
    location: "Antarctica / Arctic",
    description:
      "Explore research opportunities connected with polar observations, environmental science and scientific expeditions.",
  },
  {
    id: 2,
    type: "Internship",
    title: "Polar Science Internship",
    organization: "Research & Education",
    location: "India",
    description:
      "Opportunities for students interested in polar science, environmental research, data analysis and scientific communication.",
  },
  {
    id: 3,
    type: "Data",
    title: "Scientific Data & Analysis",
    organization: "Polar Data Community",
    location: "India",
    description:
      "Work with scientific observations, datasets, visualization and data-driven polar research.",
  },
  {
    id: 4,
    type: "Outreach",
    title: "Science Communication",
    organization: "Polar Outreach",
    location: "India",
    description:
      "Contribute to science communication, educational resources and public engagement around polar science.",
  },
  {
    id: 5,
    type: "Field Work",
    title: "Polar Field Research",
    organization: "Expedition Research",
    location: "Polar Regions",
    description:
      "Learn about field-based scientific activities involving environmental observations and research expeditions.",
  },
  {
    id: 6,
    type: "Technology",
    title: "Polar Data Technology",
    organization: "Digital Science",
    location: "India",
    description:
      "Explore opportunities involving scientific data platforms, visualization and digital tools for polar research.",
  },
];

const categories = [
  "All",
  "Research",
  "Internship",
  "Data",
  "Outreach",
  "Field Work",
  "Technology",
];

export default function CareersPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const [selectedOpportunity, setSelectedOpportunity] =
    useState<(typeof opportunities)[number] | null>(null);

  const [showApplicationForm, setShowApplicationForm] = useState(false);

  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  const [applicationData, setApplicationData] = useState({
    name: "",
    email: "",
    phone: "",
    education: "",
    statement: "",
  });

  const filteredOpportunities =
    activeCategory === "All"
      ? opportunities
      : opportunities.filter(
          (item) => item.type === activeCategory
        );

  const handleApplyClick = () => {
    if (typeof window === "undefined") return;

    const loggedIn =
      localStorage.getItem("polarLoggedIn") === "true";

    if (!loggedIn) {
      window.location.href = "/login";
      return;
    }

    setShowApplicationForm(true);
    setApplicationSubmitted(false);
  };

  const handleApplicationSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setApplicationSubmitted(true);

    setApplicationData({
      name: "",
      email: "",
      phone: "",
      education: "",
      statement: "",
    });
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950" >
      <div className="mx-auto max-w-7xl px-6 pt-6 lg:px-8">
      <BackButton />
    </div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_20%,rgba(14,165,233,0.2),transparent_36%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="max-w-4xl">
            <div className="flex flex-wrap gap-3">
              <span className="rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sky-300">
                Careers & Opportunities
              </span>

              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400">
                Research • Data • Outreach
              </span>
            </div>

            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Build a Future At The Frontiers Of Science.
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
              Discover the people, pathways and opportunities behind polar
              research.
            </p>
          </div>
        </div>
      </section>

      {/* Career paths */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-2xl dark:bg-sky-950">
              🔬
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
              Scientific Research
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Explore research paths involving polar environments,
              observations, climate and ocean science.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-2xl dark:bg-sky-950">
              📊
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
              Data & Technology
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Work with scientific datasets, visualization, software and
              digital research platforms.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-2xl dark:bg-sky-950">
              🎓
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
              Student Opportunities
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Discover learning, internship and early-career opportunities
              related to polar science.
            </p>
          </div>
        </div>
      </section>

      {/* Opportunities */}
      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              Opportunity Directory
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
              Explore Opportunities
            </h2>

            <p className="mt-3 max-w-2xl text-slate-500 dark:text-slate-400">
              Browse different career paths and areas of participation in
              polar science.
            </p>
          </div>

          <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            {filteredOpportunities.length} opportunities
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

        {/* Opportunity cards */}
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredOpportunities.map((opportunity) => (
            <article
              key={opportunity.id}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:hover:border-sky-800"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-2xl dark:bg-sky-950">
                  {opportunity.type === "Research"
                    ? "🔬"
                    : opportunity.type === "Internship"
                    ? "🎓"
                    : opportunity.type === "Data"
                    ? "📊"
                    : opportunity.type === "Outreach"
                    ? "📢"
                    : opportunity.type === "Field Work"
                    ? "🧭"
                    : "💻"}
                </div>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  {opportunity.type}
                </span>
              </div>

              <h3 className="mt-6 text-xl font-bold text-slate-900 group-hover:text-sky-700 dark:text-white dark:group-hover:text-sky-400">
                {opportunity.title}
              </h3>

              <p className="mt-2 text-sm font-medium text-sky-600 dark:text-sky-400">
                {opportunity.organization}
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {opportunity.description}
              </p>

              <div className="mt-5 flex items-center gap-2 text-xs text-slate-400">
                <span>📍</span>
                <span>{opportunity.location}</span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOpportunity(opportunity)}
                className="mt-6 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-sky-700 dark:hover:bg-sky-950/40 dark:hover:text-sky-400"
              >
                View Opportunity
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* Career guidance */}
      <section className="bg-white dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="rounded-3xl bg-slate-900 px-6 py-12 text-white sm:px-12">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-sky-400">
                  Start Your Journey
                </p>

                <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                  Your path into polar science can start here.
                </h2>

                <p className="mt-5 max-w-xl leading-7 text-slate-300">
                  Explore the portal, understand current research areas and
                  discover the skills used across scientific, technical and
                  outreach roles.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <a
                  href="/education"
                  className="rounded-xl border border-slate-700 bg-white/5 p-5 transition hover:bg-white/10"
                >
                  <span className="text-2xl">📚</span>

                  <p className="mt-3 text-sm font-semibold">Learn</p>

                  <p className="mt-1 text-xs text-slate-400">
                    Build knowledge
                  </p>
                </a>

                <a
                  href="/datasets"
                  className="rounded-xl border border-slate-700 bg-white/5 p-5 transition hover:bg-white/10"
                >
                  <span className="text-2xl">🗂️</span>

                  <p className="mt-3 text-sm font-semibold">Explore</p>

                  <p className="mt-1 text-xs text-slate-400">
                    Study datasets
                  </p>
                </a>

                <a
                  href="/visualization"
                  className="rounded-xl border border-slate-700 bg-white/5 p-5 transition hover:bg-white/10"
                >
                  <span className="text-2xl">📈</span>

                  <p className="mt-3 text-sm font-semibold">Analyse</p>

                  <p className="mt-1 text-xs text-slate-400">
                    Visualize data
                  </p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Opportunity Modal */}
      {selectedOpportunity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 px-6 py-8">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl dark:bg-slate-900">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                  {selectedOpportunity.type}
                </span>

                <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                  {selectedOpportunity.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedOpportunity(null);
                  setShowApplicationForm(false);
                  setApplicationSubmitted(false);
                }}
                className="rounded-lg px-3 py-2 text-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {!showApplicationForm && !applicationSubmitted && (
              <>
                <p className="mt-3 text-sm font-medium text-sky-600 dark:text-sky-400">
                  {selectedOpportunity.organization}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    📍 {selectedOpportunity.location}
                  </span>

                  <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                    {selectedOpportunity.type}
                  </span>
                </div>

                <p className="mt-6 leading-7 text-slate-600 dark:text-slate-400">
                  {selectedOpportunity.description}
                </p>

                <div className="mt-7 rounded-xl border border-sky-100 bg-sky-50 p-5 dark:border-sky-900 dark:bg-sky-950/40">
                  <p className="text-sm font-semibold text-sky-800 dark:text-sky-300">
                    Opportunity information
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    Explore this opportunity and submit your application if
                    you are interested in joining the polar science community.
                  </p>
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  {selectedOpportunity.type === "Internship" && (
                    <button
                      type="button"
                      onClick={handleApplyClick}
                      className="rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
                    >
                      Apply for Internship
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setSelectedOpportunity(null)}
                    className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Close
                  </button>
                </div>
              </>
            )}

            {/* Application Form */}
            {showApplicationForm && !applicationSubmitted && (
              <form
                onSubmit={handleApplicationSubmit}
                className="mt-7 space-y-5"
              >
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Internship Application
                  </h3>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Apply for {selectedOpportunity.title}.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Full Name
                  </label>

                  <input
                    type="text"
                    required
                    value={applicationData.name}
                    onChange={(event) =>
                      setApplicationData({
                        ...applicationData,
                        name: event.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Email
                    </label>

                    <input
                      type="email"
                      required
                      value={applicationData.email}
                      onChange={(event) =>
                        setApplicationData({
                          ...applicationData,
                          email: event.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Phone
                    </label>

                    <input
                      type="tel"
                      required
                      value={applicationData.phone}
                      onChange={(event) =>
                        setApplicationData({
                          ...applicationData,
                          phone: event.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Education / Qualification
                  </label>

                  <input
                    type="text"
                    required
                    value={applicationData.education}
                    onChange={(event) =>
                      setApplicationData({
                        ...applicationData,
                        education: event.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    placeholder="e.g. B.Tech Computer Science"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Why are you interested?
                  </label>

                  <textarea
                    required
                    rows={5}
                    value={applicationData.statement}
                    onChange={(event) =>
                      setApplicationData({
                        ...applicationData,
                        statement: event.target.value,
                      })
                    }
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    placeholder="Tell us briefly about your interest in polar science..."
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    className="rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
                  >
                    Submit Application
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowApplicationForm(false)}
                    className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Back
                  </button>
                </div>
              </form>
            )}

            {/* Application success */}
            {applicationSubmitted && (
              <div className="mt-7 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900 dark:bg-emerald-950/30">
                <div className="text-4xl">✅</div>

                <h3 className="mt-4 text-xl font-bold text-emerald-800 dark:text-emerald-300">
                  Application Submitted
                </h3>

                <p className="mt-2 text-sm leading-6 text-emerald-700 dark:text-emerald-400">
                  Your internship application has been submitted successfully.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedOpportunity(null);
                    setShowApplicationForm(false);
                    setApplicationSubmitted(false);
                  }}
                  className="mt-5 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}