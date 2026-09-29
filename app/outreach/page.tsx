"use client";


import { useEffect, useState } from "react";

const categories = [
  "All",
  "Gallery",
  "Webinar",
  "Research",
  "Connect",
];

const outreachItems = [
  {
    id: 1,
    category: "Gallery",
    title: "Life and Research in Antarctica",
    description:
      "A visual collection highlighting Antarctic landscapes, research activities and scientific field environments.",
    date: "12 September 2025",
  },
  {
    id: 2,
    category: "Webinar",
    title: "Inside Polar Research",
    description:
      "A science communication session exploring polar observations, research methods and scientific discoveries.",
    date: "05 September 2025",
  },
  {
    id: 3,
    category: "Research",
    title: "Southern Ocean Research",
    description:
      "Learn about oceanographic observations, carbon flux measurements and hydrographic research.",
    date: "28 August 2025",
  },
  {
    id: 4,
    category: "Gallery",
    title: "Across the Polar Landscape",
    description:
      "Explore a visual journey through remote polar environments and scientific observation sites.",
    date: "14 August 2025",
  },
];

const aiContentItems = [
  {
    id: 1,
    title: "AI Summary",
    description:
      "Create concise and easy-to-understand summaries from polar science articles, research reports and scientific content.",
    icon: "📝",
  },
  {
    id: 2,
    title: "Social Media Post",
    description:
      "Transform polar science information into engaging social media posts suitable for science outreach and public communication.",
    icon: "📱",
  },
  {
    id: 3,
    title: "Interesting Captions",
    description:
      "Generate interesting and engaging captions for polar photographs, expeditions, discoveries and scientific observations.",
    icon: "✨",
  },
];

/* -------------------------------------------------------------------------- */
/* Researcher types                                                           */
/* -------------------------------------------------------------------------- */

type ResearchDocument = {
  id: string;
  title: string;
  documentType: string;
  expeditionYear: string;
  expeditionName: string;
  expeditionLocation: string;
  department: string;
  institution: string;
  folderId: string;
  fileName: string;
  fileSize: string;
  status: "Pending Verification" | "Verified" | "Rejected";
  submittedAt: string;
};

type ResearcherProfile = {
  name: string;
  email: string;
  showEmail: boolean;
};

const STORAGE_DOCUMENTS = "polarResearchDocuments";
const STORAGE_RESEARCHER_EMAIL =
  "polarResearcherEmail";
const STORAGE_RESEARCHER_NAME =
  "polarResearcherName";
const STORAGE_SHOW_EMAIL =
  "polarResearcherShowEmail";

export default function OutreachPage() {
  const [activeCategory, setActiveCategory] =
    useState("All");

  const [selectedItem, setSelectedItem] =
    useState<
      (typeof outreachItems)[number] | null
    >(null);

  const [selectedAI, setSelectedAI] =
    useState<
      (typeof aiContentItems)[number] | null
    >(null);

  const [aiInput, setAiInput] =
    useState("");

  const [generatedContent, setGeneratedContent] =
    useState("");

  const [generatedResponse, setGeneratedResponse] =
    useState<any | null>(null);

  const [isGenerating, setIsGenerating] =
    useState(false);

  /* ---------------------------------------------------------------------- */
  /* Researcher data                                                        */
  /* ---------------------------------------------------------------------- */

  const [researchers, setResearchers] =
    useState<ResearcherProfile[]>([]);

  const [researchDocuments, setResearchDocuments] =
    useState<ResearchDocument[]>([]);

  /* ---------------------------------------------------------------------- */
  /* Load researcher information                                            */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    if (typeof window === "undefined") return;

    /*
     * Frontend prototype:
     * Read researcher contact information from localStorage.
     *
     * Later this can be replaced by:
     * GET /api/researchers
     */

    const email =
      localStorage.getItem(
        STORAGE_RESEARCHER_EMAIL
      );

    const name =
      localStorage.getItem(
        STORAGE_RESEARCHER_NAME
      );

    const showEmail =
      localStorage.getItem(
        STORAGE_SHOW_EMAIL
      );

    const storedDocuments =
      localStorage.getItem(
        STORAGE_DOCUMENTS
      );

    if (
      email &&
      showEmail === "true"
    ) {
      setResearchers([
        {
          name:
            name?.trim() ||
            "Polar Researcher",
          email: email.trim(),
          showEmail: true,
        },
      ]);
    } else {
      setResearchers([]);
    }

    if (storedDocuments) {
      try {
        const parsedDocuments =
          JSON.parse(
            storedDocuments
          );

        if (Array.isArray(parsedDocuments)) {
          setResearchDocuments(
            parsedDocuments
          );
        }
      } catch {
        setResearchDocuments([]);
      }
    }
  }, []);

  /* ---------------------------------------------------------------------- */
  /* Verified documents                                                     */
  /* ---------------------------------------------------------------------- */

  const verifiedDocuments =
    researchDocuments.filter(
      (document) =>
        document.status === "Verified"
    );

  /* ---------------------------------------------------------------------- */
  /* AI functions                                                           */
  /* ---------------------------------------------------------------------- */

  const handleGenerateClick = (
    item: (typeof aiContentItems)[number]
  ) => {
    if (
      typeof window === "undefined"
    ) {
      return;
    }

    const loggedIn =
      localStorage.getItem(
        "polarLoggedIn"
      ) === "true";

    if (!loggedIn) {
      window.location.href = "/login";
      return;
    }

    setSelectedAI(item);
    setAiInput("");
    setGeneratedContent("");
    setGeneratedResponse(null);
  };

  const handleGenerateContent = async () => {
    const input = aiInput.trim();
    if (!input || !selectedAI || isGenerating) return;

    setIsGenerating(true);
    setGeneratedContent("");
    setGeneratedResponse(null);

    try {
      const endpoint = "/api/ai/ask";

      const prompt =
        selectedAI.title === "AI Summary"
          ? `Summarize the following polar science topic using only the relevant research evidence: ${input}`
          : selectedAI.title === "Interesting Captions"
            ? `Create interesting, engaging captions about the following polar science topic using only the relevant research evidence. Return the most useful caption text for public science outreach: ${input}`
            : selectedAI.title === "Social Media Post"
              ? `Create a social media post for the following polar science topic using only the relevant research evidence. Return platform-specific outreach content: ${input}`
              : input;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: prompt }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || "The AI service could not generate content.");
      }

      let result = "";

      // Keep the structured response so the Outreach tools use the same
      // readable answer UI as the main Polar AI assistant.
      setGeneratedResponse({ ...data, query: data.query || input });

      if (selectedAI.title === "Social Media Post") {
        const platforms = Array.isArray(data.social_media?.platforms) ? data.social_media.platforms : [];
        result = platforms
          .map((item: { platform?: string; content?: string }) =>
            `${item.platform || "Social Media"}\n\n${item.content || ""}`
          )
          .filter(Boolean)
          .join("\n\n");
      } else if (selectedAI.title === "Interesting Captions") {
        const platforms = Array.isArray(data.social_media?.platforms) ? data.social_media.platforms : [];
        result = platforms
          .map((item: { platform?: string; content?: string }) => `${item.platform || "Caption"}: ${item.content || ""}`)
          .filter(Boolean)
          .join("\n\n");
      } else {
        result = data.summary || "";
      }

      setGeneratedContent(result || "The AI service returned no content for this request.");
    } catch (error) {
      setGeneratedContent(
        error instanceof Error
          ? error.message
          : "The AI service could not generate content."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const closeAIModal = () => {
    setSelectedAI(null);
    setAiInput("");
    setGeneratedContent("");
    setGeneratedResponse(null);
    setIsGenerating(false);
  };

  // Keep the close control available while the generated answer is scrolled.
  useEffect(() => {
    if (!selectedAI) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeAIModal();
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [selectedAI]);

  /* ---------------------------------------------------------------------- */
  /* Connect researcher contact                                            */
  /* ---------------------------------------------------------------------- */

  const handleContactResearcher = (
    researcher: ResearcherProfile
  ) => {
    /*
     * For now this opens the user's email client.
     *
     * Later this button can call the backend/email service,
     * which will also create a notification in the researcher's
     * Workspace -> Connections section.
     */

    const subject =
      "Contact from Polar Science Portal";

    const body =
      "Hello, I would like to connect with you regarding your polar research.";

    window.location.href =
      `mailto:${researcher.email}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
  };

  /* ---------------------------------------------------------------------- */
  /* Filter resources                                                       */
  /* ---------------------------------------------------------------------- */

  const filteredItems =
    activeCategory === "All"
      ? outreachItems
      : outreachItems.filter(
          (item) =>
            item.category ===
            activeCategory
        );

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">

      {/* ================================================================== */}
      {/* Hero                                                               */}
      {/* ================================================================== */}

      <section className="relative overflow-hidden bg-slate-950 text-white">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.18),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">

          <div className="max-w-3xl">

            <span className="rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sky-300">
              Science Communication
            </span>

            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              From Research to Reach.
            </h1>

            <p className="mt-5 text-lg leading-8 text-slate-300">
              Give specific discoveries a life beyond the
              research community.
            </p>

          </div>

        </div>
      </section>

      {/* ================================================================== */}
      {/* Introduction                                                       */}
      {/* ================================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">

        <div className="grid gap-4 md:grid-cols-4">

          <button
            type="button"
            onClick={() =>
              setActiveCategory("Gallery")
            }
            className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-sky-300 dark:border-slate-700 dark:bg-slate-900"
          >
            <span className="text-3xl">
              📷
            </span>

            <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
              Polar Gallery
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Explore visual stories from polar environments
              and research.
            </p>
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveCategory("Webinar")
            }
            className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-sky-300 dark:border-slate-700 dark:bg-slate-900"
          >
            <span className="text-3xl">
              🎥
            </span>

            <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
              Webinars
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Follow discussions and scientific communication
              sessions.
            </p>
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveCategory("Research")
            }
            className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-sky-300 dark:border-slate-700 dark:bg-slate-900"
          >
            <span className="text-3xl">
              🔬
            </span>

            <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
              Research
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Discover scientific research and polar observations.
            </p>
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveCategory("Connect")
            }
            className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-sky-300 dark:border-slate-700 dark:bg-slate-900"
          >
            <span className="text-3xl">
              🔗
            </span>

            <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
              Connect
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Discover researchers and connect with their polar
              science work.
            </p>
          </button>

        </div>

      </section>

      {/* ================================================================== */}
      {/* Connect Section                                                    */}
      {/* ================================================================== */}

      {activeCategory === "Connect" ? (
        <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">

          <div className="mb-8">

            <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">
              Researcher Network
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
              Connect with Researchers
            </h2>

            <p className="mt-3 max-w-2xl text-slate-500 dark:text-slate-400">
              Explore researchers who have chosen to make their
              contact information public and discover their verified
              research work.
            </p>

          </div>

          {researchers.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">

              <div className="text-5xl">
                🔬
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
                No public researchers yet
              </h3>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-500 dark:text-slate-400">
                Researchers will appear here after they add their
                public email in the Researcher Workspace and choose
                to show their email to users.
              </p>

            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">

              {researchers.map(
                (researcher, researcherIndex) => {

                  /*
                   * In the current frontend prototype there is one
                   * local researcher profile.
                   *
                   * When backend is connected, each researcher will
                   * have their own documents and profile.
                   */
                  const researcherDocuments =
                    verifiedDocuments;

                  return (
                    <article
                      key={`${researcher.email}-${researcherIndex}`}
                      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-sky-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900"
                    >

                      {/* Researcher Header */}
                      <div className="bg-linear-to-br from-sky-950 via-slate-900 to-slate-950 p-7 text-white">

                        <div className="flex items-start gap-4">

                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-2xl ring-1 ring-white/10">
                            👤
                          </div>

                          <div className="min-w-0">

                            <p className="text-xs font-semibold uppercase tracking-wider text-sky-300">
                              Researcher
                            </p>

                            <h3 className="mt-1 text-2xl font-bold">
                              {researcher.name}
                            </h3>

                            {researcher.email && (
                              <p className="mt-2 break-all text-sm text-slate-300">
                                ✉ {researcher.email}
                              </p>
                            )}

                          </div>

                        </div>

                      </div>

                      {/* Research Papers */}
                      <div className="p-7">

                        <div className="flex items-center justify-between gap-3">

                          <div>
                            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                              Research Papers
                            </h4>

                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                              Verified research submitted by this
                              researcher.
                            </p>
                          </div>

                          <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                            {researcherDocuments.length}
                          </span>

                        </div>

                        {researcherDocuments.length ===
                        0 ? (
                          <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center dark:border-slate-700 dark:bg-slate-950">

                            <div className="text-3xl">
                              📄
                            </div>

                            <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                              No verified papers available
                            </p>

                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                              Verified research documents will
                              appear here.
                            </p>

                          </div>
                        ) : (
                          <div className="mt-5 space-y-3">

                            {researcherDocuments.map(
                              (document) => (
                                <div
                                  key={document.id}
                                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-950"
                                >

                                  <div className="flex items-start gap-4">

                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-xl dark:bg-sky-950">
                                      📄
                                    </div>

                                    <div className="min-w-0 flex-1">

                                      <h5 className="font-bold text-slate-900 dark:text-white">
                                        {document.title}
                                      </h5>

                                      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                                        {document.documentType}
                                        {" • "}
                                        {document.expeditionYear}
                                        {" • "}
                                        {document.expeditionName}
                                      </p>

                                      <div className="mt-3 flex flex-wrap gap-2">

                                        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                          ✓ Verified
                                        </span>

                                        <span className="rounded-full bg-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                          {document.institution}
                                        </span>

                                      </div>

                                    </div>

                                  </div>

                                </div>
                              )
                            )}

                          </div>
                        )}

                        {/* Contact Button */}
                        <button
                          type="button"
                          onClick={() =>
                            handleContactResearcher(
                              researcher
                            )
                          }
                          className="mt-6 w-full rounded-xl bg-sky-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-sky-700"
                        >
                          ✉ Contact Researcher
                        </button>

                        <p className="mt-3 text-center text-xs leading-5 text-slate-400">
                          Your email application will open using
                          the researcher's public contact address.
                        </p>

                      </div>

                    </article>
                  );
                }
              )}

            </div>
          )}

        </section>
      ) : (
        <>
          {/* ============================================================ */}
          {/* Normal Outreach Library                                     */}
          {/* ============================================================ */}

          <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">

            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">
                  Outreach Library
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                  Discover & Learn
                </h2>

                <p className="mt-3 max-w-2xl text-slate-500 dark:text-slate-400">
                  Explore science communication resources across
                  different formats.
                </p>

              </div>

              <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                {filteredItems.length} resources
              </span>

            </div>

            {/* Filters */}
            <div className="mt-7 flex flex-wrap gap-2">

              {categories
                .filter(
                  (category) =>
                    category !== "Connect"
                )
                .map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() =>
                      setActiveCategory(
                        category
                      )
                    }
                    className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                      activeCategory === category
                        ? "bg-sky-600 text-white"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-sky-600 dark:hover:text-sky-400"
                    }`}
                  >
                    {category}
                  </button>
                ))}

              <button
                type="button"
                onClick={() =>
                  setActiveCategory(
                    "Connect"
                  )
                }
                className="rounded-full border border-sky-200 bg-sky-50 px-5 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-100 dark:border-sky-900 dark:bg-sky-950/50 dark:text-sky-300"
              >
                🔗 Connect
              </button>

            </div>

            {/* Cards */}
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

              {filteredItems.map(
                (item) => (
                  <article
                    key={item.id}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:hover:border-sky-800"
                  >

                    <div className="flex h-44 items-center justify-center bg-linear-to-br from-sky-100 via-slate-100 to-slate-200 text-5xl dark:from-sky-950 dark:via-slate-900 dark:to-slate-800">
                      {item.category ===
                      "Gallery"
                        ? "📷"
                        : item.category ===
                          "Webinar"
                        ? "🎥"
                        : "🔬"}
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
                        onClick={() =>
                          setSelectedItem(
                            item
                          )
                        }
                        className="mt-5 text-sm font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
                      >
                        Explore Resource →
                      </button>

                    </div>

                  </article>
                )
              )}

            </div>

          </section>
        </>
      )}

      {/* ================================================================== */}
      {/* AI Generated Content                                               */}
      {/* ================================================================== */}

      <section className="border-y border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">

        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">

          <div className="max-w-3xl">

            <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">
              AI Outreach Toolkit
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
              AI Generated Content
            </h2>

            <p className="mt-3 leading-7 text-slate-500 dark:text-slate-400">
              Create engaging science communication content using
              AI-powered outreach tools.
            </p>

          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">

            {aiContentItems.map(
              (item) => (
                <div
                  key={item.id}
                  className="group rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:-translate-y-1 hover:border-sky-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:hover:border-sky-700"
                >

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-3xl dark:bg-sky-950">
                    {item.icon}
                  </div>

                  <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    {item.description}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      handleGenerateClick(
                        item
                      )
                    }
                    className="mt-5 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700"
                  >
                    Generate Content →
                  </button>

                </div>
              )
            )}

          </div>

        </div>

      </section>

      {/* ================================================================== */}
      {/* CTA                                                                */}
      {/* ================================================================== */}

      <section className="bg-white dark:bg-slate-950">

        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">

          <div className="rounded-3xl bg-slate-900 px-6 py-12 text-center text-white sm:px-12">

            <p className="text-xs font-semibold uppercase tracking-wider text-sky-400">
              Polar Knowledge
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              Discover the science behind the ice.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-300">
              Explore datasets, educational resources and
              scientific visualizations alongside the outreach
              library.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">

              <a
                href="/education"
                className="rounded-xl bg-sky-500 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-400"
              >
                Explore Education
              </a>

              <a
                href="/visualization"
                className="rounded-xl border border-slate-600 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Explore Data
              </a>

            </div>

          </div>

        </div>

      </section>

      {/* ================================================================== */}
      {/* Resource Modal                                                     */}
      {/* ================================================================== */}

      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-6">

          <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl dark:bg-slate-900">

            <div className="flex items-start justify-between gap-4">

              <div>

                <span className="text-xs font-semibold uppercase tracking-wider text-sky-600">
                  {selectedItem.category}
                </span>

                <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                  {selectedItem.title}
                </h2>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedItem(
                    null
                  )
                }
                className="rounded-lg px-3 py-2 text-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                aria-label="Close"
              >
                ×
              </button>

            </div>

            <p className="mt-5 text-sm text-slate-400">
              {selectedItem.date}
            </p>

            <p className="mt-5 leading-7 text-slate-600 dark:text-slate-300">
              {selectedItem.description}
            </p>

            <button
              type="button"
              onClick={() =>
                setSelectedItem(
                  null
                )
              }
              className="mt-7 rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-700"
            >
              Close
            </button>

          </div>

        </div>
      )}

      {/* ================================================================== */}
      {/* AI Generator Modal                                                 */}
      {/* ================================================================== */}

      {selectedAI && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/55 p-3 sm:p-5">
          <div className="flex h-[min(92vh,900px)] w-full max-w-[1140px] flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <div className="sticky top-0 z-30 flex shrink-0 items-center justify-between border-b border-slate-200 bg-white/95 px-6 py-5 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
              <div>
                <p className="text-sm font-extrabold uppercase tracking-[0.12em] text-sky-600 dark:text-sky-400">
                  AI Research Assistant
                </p>
                <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                  {selectedAI.title}
                </h2>
                {generatedResponse?.query && (
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Research question: {generatedResponse.query}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={closeAIModal}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-2xl font-semibold leading-none text-slate-600 shadow-sm transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-sky-600 dark:hover:bg-slate-700 dark:hover:text-sky-300"
                aria-label={`Close ${selectedAI.title}`}
                title="Close"
              >
                ×
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto bg-white px-6 py-6 dark:bg-slate-900">
              {!generatedResponse && !isGenerating && (
                <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-950">
                  <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
                    Enter a polar science topic. This tool uses the indexed research collection and presents the result in a structured, easy-to-read format.
                  </p>
                </div>
              )}

              {isGenerating && (
                <div className="mx-auto max-w-4xl space-y-4">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-950">
                    <p className="text-sm font-semibold text-sky-600 dark:text-sky-400">RESEARCHING</p>
                    <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                      Searching the research collection and preparing concise outreach content…
                    </p>
                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                      <div className="h-full w-1/2 animate-pulse rounded-full bg-sky-500" />
                    </div>
                  </div>
                </div>
              )}

              {generatedResponse && !isGenerating && (
                <div className="mx-auto max-w-4xl space-y-5">
                  <section className="rounded-2xl border border-sky-100 bg-sky-50/60 p-6 dark:border-sky-900/60 dark:bg-sky-950/20">
                    <p className="text-sm font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400">Summary</p>
                    <p className="mt-3 text-[15px] leading-7 text-slate-700 dark:text-slate-200">
                      {generatedResponse.summary || "No concise summary was returned from the retrieved evidence."}
                    </p>
                  </section>

                  <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400">Key Points</p>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">10 points</span>
                    </div>
                    <div className="mt-4 grid gap-x-8 gap-y-3 md:grid-cols-2">
                      {(generatedResponse.key_points || []).slice(0, 10).map((point: string, i: number) => (
                        <div key={`${point}-${i}`} className="flex gap-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-sky-500" />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  {selectedAI.title === "Social Media Post" && (
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-sm font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400">Social Media Content</p>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">5 platforms</span>
                      </div>
                      <div className="mt-5 space-y-4">
                        {(generatedResponse.social_media?.platforms || []).map((item: { platform?: string; content?: string }, i: number) => (
                          <div key={`${item.platform}-${i}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-950">
                            <div className="flex items-center justify-between gap-3">
                              <h3 className="font-bold text-slate-900 dark:text-white">{item.platform || "Social Media"}</h3>
                              <button type="button" onClick={() => navigator.clipboard?.writeText(item.content || "")} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-sky-700 hover:border-sky-300 dark:border-slate-700 dark:bg-slate-900 dark:text-sky-300">Copy</button>
                            </div>
                            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700 dark:text-slate-300">{item.content}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {selectedAI.title === "Interesting Captions" && (
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-sm font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400">Caption Options</p>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">5 options</span>
                      </div>
                      <div className="mt-5 grid gap-4">
                        {(generatedResponse.social_media?.platforms || []).map((item: { platform?: string; content?: string }, i: number) => (
                          <div key={`${item.platform}-${i}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-950">
                            <div className="flex items-center justify-between gap-3">
                              <h3 className="font-bold text-slate-900 dark:text-white">{item.platform || `Caption ${i + 1}`}</h3>
                              <button type="button" onClick={() => navigator.clipboard?.writeText(item.content || "")} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-sky-700 hover:border-sky-300 dark:border-slate-700 dark:bg-slate-900 dark:text-sky-300">Copy</button>
                            </div>
                            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700 dark:text-slate-300">{item.content}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {selectedAI.title === "AI Summary" && generatedResponse.research_figure?.data_uri && (
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
                      <p className="text-sm font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400">Research Figure</p>
                      <img src={generatedResponse.research_figure.data_uri} alt="Figure extracted from the relevant research PDF" className="mt-4 max-h-[460px] w-full rounded-xl bg-white object-contain dark:bg-slate-950" />
                    </section>
                  )}

                  {selectedAI.title === "AI Summary" && generatedResponse.visualization?.enabled && (generatedResponse.visualization.chart_image || generatedResponse.visualization.chart_url) && (
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
                      <p className="text-sm font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400">Visualization</p>
                      <h3 className="mt-2 text-base font-bold text-slate-900 dark:text-white">{generatedResponse.visualization.title || "Research data visualization"}</h3>
                      <img src={generatedResponse.visualization.chart_image || generatedResponse.visualization.chart_url} alt={generatedResponse.visualization.title || "Research data visualization"} className="mt-4 w-full rounded-xl" />
                      {generatedResponse.visualization.note && <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">{generatedResponse.visualization.note}</p>}
                    </section>
                  )}

                  {generatedResponse.metadata && (
                    <details className="group rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                      <summary className="cursor-pointer list-none px-5 py-4 text-sm font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                        Research Metadata <span className="float-right text-slate-400 group-open:rotate-180">⌄</span>
                      </summary>
                      <div className="grid gap-2 border-t border-slate-100 p-5 sm:grid-cols-2 dark:border-slate-800">
                        {[
                          ["Source", generatedResponse.metadata.source],
                          ["Location", generatedResponse.metadata.location],
                          ["Time / Period", generatedResponse.metadata.time_period],
                          ["Subject", generatedResponse.metadata.subject],
                          ["Important Finding", generatedResponse.metadata.important_finding],
                          ["Data / Evidence", generatedResponse.metadata.data_evidence],
                          ["Cause / Effect", generatedResponse.metadata.cause_effect],
                          ["Scientific Significance", generatedResponse.metadata.scientific_significance],
                          ["Related Sources", generatedResponse.metadata.related_sources],
                          ["Confidence / Coverage", generatedResponse.metadata.confidence_coverage],
                        ].map(([label, value]) => (
                          <div key={label} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-950">
                            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
                            <p className="mt-1 text-xs leading-5 text-slate-700 dark:text-slate-300">{Array.isArray(value) ? value.join(" · ") : value || "Not specified"}</p>
                          </div>
                        ))}
                      </div>
                    </details>
                  )}

                  {!!generatedResponse.sources?.length && (
                    <details className="group rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                      <summary className="cursor-pointer list-none px-5 py-4 text-sm font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                        Source Evidence <span className="float-right text-slate-400 group-open:rotate-180">⌄</span>
                      </summary>
                      <div className="space-y-2 border-t border-slate-100 p-5 dark:border-slate-800">
                        {generatedResponse.sources.map((source: any, i: number) => (
                          <div key={`${source.source_file}-${source.page}-${i}`} className="rounded-xl border border-slate-200 p-3 text-xs dark:border-slate-700">
                            <b className="text-slate-800 dark:text-slate-200">{source.source_file}</b>{source.page ? ` · page ${source.page}` : ""}
                            {source.evidence_note && <p className="mt-1 text-slate-500 dark:text-slate-400">{source.evidence_note}</p>}
                          </div>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
              )}
            </div>

            <form
              onSubmit={(event) => { event.preventDefault(); handleGenerateContent(); }}
              className="shrink-0 border-t border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex gap-3">
                <textarea
                  value={aiInput}
                  onChange={(event) => setAiInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      handleGenerateContent();
                    }
                  }}
                  rows={2}
                  placeholder="Ask or describe the polar science content you want…"
                  className="min-w-0 flex-1 resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={!aiInput.trim() || isGenerating}
                  className="self-end rounded-xl bg-sky-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isGenerating ? "Generating…" : "Generate"}
                </button>
              </div>
              <p className="mt-2 text-[11px] text-slate-400">Content is grounded in the indexed research collection.</p>
            </form>
          </div>
        </div>
      )}

    </main>
  );
}