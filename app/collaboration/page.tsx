"use client";
import BackButton from "../../src/components/BackButton";

import { useState } from "react";

const collaborationAreas = [
  {
    id: 1,
    title: "Research Collaboration",
    category: "Research",
    icon: "🔬",
    description:
      "Connect researchers and institutions working on polar environments, climate, oceans and environmental science.",
    details:
      "Research collaboration can bring together expertise from multiple scientific disciplines and institutions to support polar research activities.",
  },
  {
    id: 2,
    title: "Data Sharing",
    category: "Data",
    icon: "🗂️",
    description:
      "Share scientific observations, datasets and research outputs through a common knowledge ecosystem.",
    details:
      "Data collaboration supports the discovery, interpretation and reuse of scientific observations across different polar research areas.",
  },
  {
    id: 3,
    title: "Academic Partnerships",
    category: "Education",
    icon: "🎓",
    description:
      "Build connections between universities, students, researchers and polar science programmes.",
    details:
      "Academic partnerships can support student projects, scientific training, research activities and educational initiatives.",
  },
  {
    id: 4,
    title: "Technology & Innovation",
    category: "Technology",
    icon: "💻",
    description:
      "Develop digital tools, visualization systems and technologies that support polar science.",
    details:
      "Technology collaboration can improve how scientific information is explored, visualized and communicated.",
  },
  {
    id: 5,
    title: "Science Outreach",
    category: "Outreach",
    icon: "📢",
    description:
      "Work together to make polar science accessible to students, educators and the wider public.",
    details:
      "Outreach partnerships help communicate scientific knowledge through educational resources, events and public engagement.",
  },
  {
    id: 6,
    title: "International Cooperation",
    category: "Research",
    icon: "🌐",
    description:
      "Support scientific exchange and collaboration across the international polar research community.",
    details:
      "International cooperation can connect scientific expertise, observations and research capabilities across geographic regions.",
  },
];

const categories = [
  "All",
  "Research",
  "Data",
  "Education",
  "Technology",
  "Outreach",
];

export default function CollaborationPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const [selectedArea, setSelectedArea] =
    useState<(typeof collaborationAreas)[number] | null>(null);

  const [showCollaborationForm, setShowCollaborationForm] =
    useState(false);

  const [requestSubmitted, setRequestSubmitted] = useState(false);

  const [collaborationData, setCollaborationData] = useState({
    name: "",
    email: "",
    organization: "",
    message: "",
  });

  const filteredAreas =
    activeCategory === "All"
      ? collaborationAreas
      : collaborationAreas.filter(
          (area) => area.category === activeCategory
        );

  const handleStartCollaboration = () => {
    if (typeof window === "undefined") return;

    const loggedIn =
      localStorage.getItem("polarLoggedIn") === "true";

    if (!loggedIn) {
      window.location.href = "/login";
      return;
    }

    setShowCollaborationForm(true);
    setRequestSubmitted(false);
  };

  const handleCollaborationSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setRequestSubmitted(true);

    setCollaborationData({
      name: "",
      email: "",
      organization: "",
      message: "",
    });
  };

  const closeModal = () => {
    setSelectedArea(null);
    setShowCollaborationForm(false);
    setRequestSubmitted(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
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
                Collaboration
              </span>

              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400">
                Research • Data • Education
              </span>
            </div>

            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Connect The Minds Behind Discovery.
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
              Bring researchers, institutions and ideas together across
              disciplines and borders.
            </p>
          </div>
        </div>
      </section>

      {/* Collaboration overview */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-2xl dark:bg-sky-950">
              🤝
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
              Connect
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Bring together people and organizations working across different
              areas of polar science.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-2xl dark:bg-sky-950">
              🧩
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
              Share
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Encourage sharing of knowledge, observations, research and
              scientific resources.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-2xl dark:bg-sky-950">
              🚀
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
              Collaborate
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Turn shared knowledge and expertise into research, education and
              innovation opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Collaboration areas */}
      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              Collaboration Directory
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
              Explore Collaboration Areas
            </h2>

            <p className="mt-3 max-w-2xl text-slate-500 dark:text-slate-400">
              Explore different ways the polar science ecosystem can work
              together.
            </p>
          </div>

          <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            {filteredAreas.length} areas
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

        {/* Cards */}
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAreas.map((area) => (
            <article
              key={area.id}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:hover:border-sky-800"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-2xl dark:bg-sky-950">
                  {area.icon}
                </div>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  {area.category}
                </span>
              </div>

              <h3 className="mt-6 text-xl font-bold text-slate-900 group-hover:text-sky-700 dark:text-white dark:group-hover:text-sky-400">
                {area.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {area.description}
              </p>

              <button
                type="button"
                onClick={() => {
                  setSelectedArea(area);
                  setShowCollaborationForm(false);
                  setRequestSubmitted(false);
                }}
                className="mt-6 text-sm font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
              >
                Explore Area →
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* Collaboration workflow */}
      <section className="bg-white dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              How It Works
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
              From connection to collaboration
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-500 dark:text-slate-400">
              A simple pathway for discovering knowledge, identifying shared
              interests and developing collaborative opportunities.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <StepCard
              number="01"
              title="Discover"
              description="Explore research, datasets, education and outreach resources across the portal."
            />

            <StepCard
              number="02"
              title="Connect"
              description="Identify research areas, institutions and communities with shared interests."
            />

            <StepCard
              number="03"
              title="Collaborate"
              description="Develop research, educational, technical or outreach initiatives together."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-50 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="rounded-3xl bg-slate-900 px-6 py-12 text-center text-white sm:px-12">
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-400">
              Explore the Portal
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Start with knowledge. Build connections.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-300">
              Explore datasets, educational resources and outreach material to
              understand the wider polar science ecosystem.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="/datasets"
                className="rounded-xl bg-sky-500 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-400"
              >
                Explore Datasets
              </a>

              <a
                href="/education"
                className="rounded-xl border border-slate-600 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Explore Education
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Collaboration Modal */}
      {selectedArea && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 px-6 py-8">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl dark:bg-slate-900">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                  {selectedArea.category}
                </span>

                <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                  {selectedArea.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg px-3 py-2 text-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {!showCollaborationForm && !requestSubmitted && (
              <>
                <p className="mt-6 leading-7 text-slate-600 dark:text-slate-400">
                  {selectedArea.details}
                </p>

                <div className="mt-7 rounded-xl border border-sky-100 bg-sky-50 p-5 dark:border-sky-900 dark:bg-sky-950/40">
                  <p className="text-sm font-semibold text-sky-800 dark:text-sky-300">
                    Collaboration opportunity
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    Start a collaboration request with the polar science
                    community.
                  </p>
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleStartCollaboration}
                    className="rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-700"
                  >
                    Start Collaboration
                  </button>

                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Close
                  </button>
                </div>
              </>
            )}

            {/* Collaboration Form */}
            {showCollaborationForm && !requestSubmitted && (
              <form
                onSubmit={handleCollaborationSubmit}
                className="mt-7 space-y-5"
              >
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Collaboration Request
                  </h3>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Tell us about your collaboration interest.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Full Name
                  </label>

                  <input
                    type="text"
                    required
                    value={collaborationData.name}
                    onChange={(event) =>
                      setCollaborationData({
                        ...collaborationData,
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
                      value={collaborationData.email}
                      onChange={(event) =>
                        setCollaborationData({
                          ...collaborationData,
                          email: event.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Organization / Institution
                    </label>

                    <input
                      type="text"
                      required
                      value={collaborationData.organization}
                      onChange={(event) =>
                        setCollaborationData({
                          ...collaborationData,
                          organization: event.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                      placeholder="University / Organization"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Collaboration Details
                  </label>

                  <textarea
                    required
                    rows={5}
                    value={collaborationData.message}
                    onChange={(event) =>
                      setCollaborationData({
                        ...collaborationData,
                        message: event.target.value,
                      })
                    }
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    placeholder="Describe what you would like to collaborate on..."
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    className="rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-700"
                  >
                    Submit Collaboration Request
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowCollaborationForm(false)}
                    className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Back
                  </button>
                </div>
              </form>
            )}

            {/* Success */}
            {requestSubmitted && (
              <div className="mt-7 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900 dark:bg-emerald-950/30">
                <div className="text-4xl">✅</div>

                <h3 className="mt-4 text-xl font-bold text-emerald-800 dark:text-emerald-300">
                  Collaboration Request Submitted
                </h3>

                <p className="mt-2 text-sm leading-6 text-emerald-700 dark:text-emerald-400">
                  Your collaboration request has been submitted successfully.
                </p>

                <button
                  type="button"
                  onClick={closeModal}
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

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900">
      <span className="text-sm font-bold text-sky-600 dark:text-sky-400">
        {number}
      </span>

      <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}