"use client";

import { useState } from "react";

type Source = {
  source_file?: string;
  page?: number;
  relevance?: number;
  evidence_note?: string;
};

type Answer = {
  query?: string;
  summary?: string;
  key_points?: string[];
  visualization?: {
    enabled?: boolean;
    title?: string;
    chart_image?: string;
    chart_url?: string;
    note?: string;
  };
  metadata?: Record<string, string | string[] | undefined>;
  sources?: Source[];
  research_figure?: { data_uri?: string; url?: string; source_file?: string; page?: number; kind?: string } | null;
};

const API = "/api/ai";

const suggestions = [
  "Summarize the research on Antarctic weather stations",
  "What were the main findings about radio wave propagation in Antarctica?",
  "What temperature observations were reported in the research?",
];

export default function AIResearchAssistant() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const ask = async (text = query) => {
    const value = text.trim();
    if (!value || loading) return;

    setLoading(true);
    setError("");
    setAnswer(null);
    try {
      const response = await fetch(`${API}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: value }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not get an answer.");
      setAnswer(data);
      setQuery("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not get an answer.");
    } finally {
      setLoading(false);
    }
  };

  const metadata = answer?.metadata || {};
  const visual = answer?.visualization;
  const image = visual?.chart_image || visual?.chart_url;
  const figure = answer?.research_figure;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-sky-600 px-5 py-3 text-sm font-bold text-white shadow-xl shadow-sky-950/25 transition hover:bg-sky-700"
        aria-label="Open AI research assistant"
      >
        ✦ Ask Polar AI
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/55 p-3 sm:p-5">
          <div className="flex h-[min(92vh,900px)] w-full max-w-[1140px] flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-800">
              <div>
                <p className="text-sm font-extrabold uppercase tracking-[0.12em] text-sky-600 dark:text-sky-400">
                  AI Research Assistant
                </p>
                <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                  Ask about polar research
                </h2>
                {answer?.query && (
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Research question: {answer.query}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full px-3 py-2 text-2xl font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto bg-white px-6 py-6 dark:bg-slate-900">
              {!answer && !loading && !error && (
                <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-950">
                  <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
                    Ask a question about the indexed polar research collection. The assistant answers from the research PDFs and can return a concise summary, ten key points, evidence, metadata, extracted figures, and a data visualization when the source contains usable numerical data.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {suggestions.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => ask(prompt)}
                        className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-sky-300 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {loading && (
                <div className="mx-auto max-w-4xl space-y-4">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-950">
                    <p className="text-sm font-semibold text-sky-600 dark:text-sky-400">RESEARCHING</p>
                    <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                      Searching the research collection, checking source evidence, and preparing a concise answer…
                    </p>
                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                      <div className="h-full w-1/2 animate-pulse rounded-full bg-sky-500" />
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="mx-auto max-w-4xl rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                  {error}
                </div>
              )}

              {answer && !loading && (
                <div className="mx-auto max-w-4xl space-y-5">
                  <section className="rounded-2xl border border-sky-100 bg-sky-50/60 p-6 dark:border-sky-900/60 dark:bg-sky-950/20">
                    <p className="text-sm font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400">Summary</p>
                    <p className="mt-3 text-[15px] leading-7 text-slate-700 dark:text-slate-200">
                      {answer.summary || "No concise summary was returned from the retrieved evidence."}
                    </p>
                  </section>

                  <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400">Key Points</p>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">10 points</span>
                    </div>
                    <div className="mt-4 grid gap-x-8 gap-y-3 md:grid-cols-2">
                      {(answer.key_points || []).slice(0, 10).map((point, i) => (
                        <div key={`${point}-${i}`} className="flex gap-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-sky-500" />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  {figure && (figure.data_uri || figure.url) && (
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
                      <p className="text-sm font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400">Research Figure</p>
                      <img
                        src={figure.data_uri || figure.url}
                        alt="Figure extracted from the relevant research PDF"
                        className="mt-4 max-h-[460px] w-full rounded-xl bg-white object-contain dark:bg-slate-950"
                      />
                      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                        {figure.source_file}{figure.page ? ` · page ${figure.page}` : ""}
                      </p>
                    </section>
                  )}

                  {image && visual?.enabled && (
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
                      <p className="text-sm font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400">Visualization</p>
                      <h3 className="mt-2 text-base font-bold text-slate-900 dark:text-white">{visual.title || "Research data visualization"}</h3>
                      <img src={image} alt={visual.title || "Research data visualization"} className="mt-4 w-full rounded-xl" />
                      {visual.note && <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">{visual.note}</p>}
                    </section>
                  )}

                  <details className="group rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                    <summary className="cursor-pointer list-none px-5 py-4 text-sm font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                      Research Metadata <span className="float-right text-slate-400 group-open:rotate-180">⌄</span>
                    </summary>
                    <div className="grid gap-2 border-t border-slate-100 p-5 sm:grid-cols-2 dark:border-slate-800">
                      {[
                        ["Source", metadata.source],
                        ["Location", metadata.location],
                        ["Time / Period", metadata.time_period],
                        ["Subject", metadata.subject],
                        ["Important Finding", metadata.important_finding],
                        ["Data / Evidence", metadata.data_evidence],
                        ["Cause / Effect", metadata.cause_effect],
                        ["Scientific Significance", metadata.scientific_significance],
                        ["Related Sources", metadata.related_sources],
                        ["Confidence / Coverage", metadata.confidence_coverage],
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-950">
                          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
                          <p className="mt-1 text-xs leading-5 text-slate-700 dark:text-slate-300">
                            {Array.isArray(value) ? value.join(" · ") : value || "Not specified"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </details>

                  {!!answer.sources?.length && (
                    <details className="group rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                      <summary className="cursor-pointer list-none px-5 py-4 text-sm font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                        Source Evidence <span className="float-right text-slate-400 group-open:rotate-180">⌄</span>
                      </summary>
                      <div className="space-y-2 border-t border-slate-100 p-5 dark:border-slate-800">
                        {answer.sources.map((source, i) => (
                          <div key={`${source.source_file}-${source.page}-${i}`} className="rounded-xl border border-slate-200 p-3 text-xs dark:border-slate-700">
                            <b className="text-slate-800 dark:text-slate-200">{source.source_file}</b>
                            {source.page ? ` · page ${source.page}` : ""}
                            {source.evidence_note && <p className="mt-1 text-slate-500 dark:text-slate-400">{source.evidence_note}</p>}
                          </div>
                        ))}
                      </div>
                    </details>
                  )}

                  <button
                    type="button"
                    onClick={() => setAnswer(null)}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:text-sky-600 dark:border-slate-700 dark:text-slate-300"
                  >
                    Ask another question
                  </button>
                </div>
              )}
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                ask();
              }}
              className="shrink-0 border-t border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex gap-3">
                <textarea
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      ask();
                    }
                  }}
                  rows={2}
                  placeholder="Ask a question about the polar research collection…"
                  className="min-w-0 flex-1 resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={!query.trim() || loading}
                  className="self-end rounded-xl bg-sky-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Searching…" : "Ask AI"}
                </button>
              </div>
              <p className="mt-2 text-[11px] text-slate-400">Answers are grounded in the indexed research collection.</p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
