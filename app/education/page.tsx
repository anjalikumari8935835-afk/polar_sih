"use client";

import { useState } from "react";

const topics = [
  "All",
  "Polar Basics",
  "Climate",
  "Research",
];

const lessons = [
  {
    id: 1,
    topic: "Polar Basics",
    level: "Beginner",
    title: "Introduction to Polar Science",
    description:
      "Learn what polar science is, why polar regions are studied, and how observations help us understand Earth.",
    duration: "8 min",
    icon: "❄️",
  },
  {
    id: 2,
    topic: "Climate",
    level: "Beginner",
    title: "Polar Regions and Climate",
    description:
      "Understand the relationship between the polar regions, atmosphere, oceans and the global climate system.",
    duration: "10 min",
    icon: "🌍",
  },
  {
    id: 4,
    topic: "Research",
    level: "Intermediate",
    title: "How Polar Observations Work",
    description:
      "Discover how researchers collect environmental measurements at stations and during field expeditions.",
    duration: "9 min",
    icon: "🔬",
  },
  {
    id: 5,
    topic: "Climate",
    level: "Intermediate",
    title: "Understanding Polar Data",
    description:
      "Learn how temperature, wind, humidity and other measurements can be interpreted as scientific observations.",
    duration: "11 min",
    icon: "📊",
  },
  {
    id: 6,
    topic: "Research",
    level: "Advanced",
    title: "From Observation to Dataset",
    description:
      "Follow the journey from scientific observation to structured datasets used for analysis and research.",
    duration: "14 min",
    icon: "🧪",
  },
];

const faqs = [
  {
    question: "What is polar science?",
    answer:
      "Polar science is the study of the Earth's polar regions, including their atmosphere, ice, environment, climate, ecosystems and scientific processes.",
  },
  {
    question: "Why are polar regions important?",
    answer:
      "Polar regions are important because changes in these environments can provide valuable information about Earth's climate, atmosphere, oceans and environmental systems.",
  },
  {
    question: "Who can use the Education section?",
    answer:
      "The Education section is designed for students, educators, researchers and anyone interested in learning about polar science.",
  },
  {
    question: "What are polar datasets?",
    answer:
      "Polar datasets are collections of scientific observations and measurements gathered from polar environments through stations, instruments, field expeditions and other research activities.",
  },
  {
    question: "Do I need an account to access the quiz?",
    answer:
      "The quiz is available to users after they log in. Visitors can see the quiz option, but they need to log in before starting the quiz.",
  },
];

const quizQuestions = [
  {
    question: "Which regions are commonly referred to as the polar regions?",
    options: [
      "The Arctic and Antarctic",
      "The tropics and equator",
      "Only the Arctic",
      "Only the Antarctic",
    ],
    answer: 0,
  },
  {
    question: "What do polar scientists commonly collect during field research?",
    options: [
      "Environmental measurements",
      "Only photographs",
      "Only population surveys",
      "Only satellite images",
    ],
    answer: 0,
  },
  {
    question: "Which of these can be part of a polar dataset?",
    options: [
      "Temperature measurements",
      "Only researcher's names",
      "Only photographs",
      "Only written reports",
    ],
    answer: 0,
  },
  {
    question: "What is one purpose of polar observations?",
    options: [
      "To understand environmental and climate processes",
      "To replace all scientific models",
      "To eliminate field research",
      "To avoid collecting measurements",
    ],
    answer: 0,
  },
  {
    question: "What can happen to scientific observations after collection?",
    options: [
      "They can be organized into datasets for analysis",
      "They must always be deleted",
      "They cannot be analyzed",
      "They can only be used once",
    ],
    answer: 0,
  },
];

export default function EducationPage() {
  const [activeTopic, setActiveTopic] = useState("All");
  const [selectedLesson, setSelectedLesson] =
    useState<(typeof lessons)[number] | null>(null);

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const filteredLessons =
    activeTopic === "All"
      ? lessons
      : lessons.filter((lesson) => lesson.topic === activeTopic);

  const handleStartQuiz = () => {
    if (typeof window === "undefined") return;

    const loggedIn = localStorage.getItem("polarLoggedIn") === "true";

    if (!loggedIn) {
      window.location.href = "/login";
      return;
    }

    setShowQuiz(true);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setQuizScore(0);
    setQuizFinished(false);
  };

  const handleQuizAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answerIndex);

    if (answerIndex === quizQuestions[currentQuestion].answer) {
      setQuizScore((previous) => previous + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion((previous) => previous + 1);
      setSelectedAnswer(null);
    } else {
      setQuizFinished(true);
    }
  };

  const closeQuiz = () => {
    setShowQuiz(false);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setQuizScore(0);
    setQuizFinished(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(14,165,233,0.2),transparent_36%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="max-w-4xl">
            <div className="flex flex-wrap gap-3">
              <span className="rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sky-300">
                Polar Education
              </span>

              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400">
                Learn • Explore • Discover
              </span>
            </div>

            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Curiosity Meet The Extreme.
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
              Learn the science, systems and stories hidden within the polar
              world.
            </p>
          </div>
        </div>
      </section>

      {/* Learning paths */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-2xl dark:bg-sky-950">
              📚
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
              Build Foundations
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Start with the basics of polar environments, research and
              scientific observations.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-2xl dark:bg-sky-950">
              🔍
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
              Explore Research
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Understand how scientists collect, analyse and use observations
              from polar environments.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-2xl dark:bg-sky-950">
              📊
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
              Work With Data
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Connect scientific concepts with datasets and interactive
              visualizations.
            </p>
          </div>
        </div>
      </section>

      {/* Quiz */}
      <section className="mx-auto max-w-7xl px-6 pb-12 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-sky-200 bg-linear-to-br from-sky-50 via-white to-slate-50 p-8 shadow-sm dark:border-sky-900 dark:from-sky-950/40 dark:via-slate-900 dark:to-slate-950 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                Test Your Knowledge
              </span>

              <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
                Polar Science Quiz
              </h2>

              <p className="mt-3 max-w-2xl leading-7 text-slate-600 dark:text-slate-400">
                Test your understanding of polar science, observations,
                datasets and research through a short interactive quiz.
              </p>

              <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">
                Login is required to participate in the quiz.
              </p>
            </div>

            <button
              type="button"
              onClick={handleStartQuiz}
              className="rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
            >
              Start Quiz →
            </button>
          </div>
        </div>
      </section>

      {/* Lessons */}
      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              Learning Library
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
              Explore Learning Modules
            </h2>

            <p className="mt-3 max-w-2xl text-slate-500 dark:text-slate-400">
              Select a topic and explore short, focused learning resources.
            </p>
          </div>

          <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            {filteredLessons.length} modules
          </span>
        </div>

        {/* Filters */}
        <div className="mt-7 flex flex-wrap gap-2">
          {topics.map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => setActiveTopic(topic)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                activeTopic === topic
                  ? "bg-sky-600 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-sky-600 dark:hover:text-sky-400"
              }`}
            >
              {topic}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredLessons.map((lesson) => (
            <article
              key={lesson.id}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:hover:border-sky-800"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-2xl dark:bg-sky-950">
                  {lesson.icon}
                </div>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  {lesson.level}
                </span>
              </div>

              <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                {lesson.topic}
              </p>

              <h3 className="mt-2 text-xl font-bold text-slate-900 group-hover:text-sky-700 dark:text-white dark:group-hover:text-sky-400">
                {lesson.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {lesson.description}
              </p>

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5 dark:border-slate-700">
                <span className="text-xs font-medium text-slate-400">
                  ⏱ {lesson.duration}
                </span>

                <button
                  type="button"
                  onClick={() => setSelectedLesson(lesson)}
                  className="text-sm font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
                >
                  Start Learning →
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-100 dark:bg-slate-900/70">
        <div className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              Frequently Asked Questions
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
              Questions About Polar Education
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-slate-500 dark:text-slate-400">
              Find answers to common questions about the educational resources
              and learning experiences available on the portal.
            </p>
          </div>

          <div className="mt-10 space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950"
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenFaq(openFaq === index ? null : index)
                  }
                  className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left"
                >
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {faq.question}
                  </span>

                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-lg text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {openFaq === index ? "−" : "+"}
                  </span>
                </button>

                {openFaq === index && (
                  <div className="border-t border-slate-100 px-6 py-5 dark:border-slate-800">
                    <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data connection */}
      <section className="bg-white dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                Learn Through Data
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Turn scientific concepts into exploration.
              </h2>

              <p className="mt-5 max-w-xl leading-7 text-slate-600 dark:text-slate-400">
                Move from educational concepts to real-looking polar
                observations using the portal&apos;s dataset and visualization
                experiences.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <a
                href="/datasets"
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:border-sky-200 hover:bg-white hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-sky-800 dark:hover:bg-slate-800"
              >
                <span className="text-3xl">🗂️</span>

                <h3 className="mt-4 font-bold text-slate-900 dark:text-white">
                  Browse Datasets
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Explore the portal&apos;s scientific dataset collection.
                </p>

                <span className="mt-4 block text-sm font-semibold text-sky-600 dark:text-sky-400">
                  Open datasets →
                </span>
              </a>

              <a
                href="/visualization"
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:border-sky-200 hover:bg-white hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-sky-800 dark:hover:bg-slate-800"
              >
                <span className="text-3xl">📈</span>

                <h3 className="mt-4 font-bold text-slate-900 dark:text-white">
                  Visualize Data
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Interact with polar observations and environmental
                  measurements.
                </p>

                <span className="mt-4 block text-sm font-semibold text-sky-600 dark:text-sky-400">
                  Open visualization →
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Lesson Modal */}
      {selectedLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-6">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl dark:bg-slate-900">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                  {selectedLesson.topic}
                </span>

                <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                  {selectedLesson.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLesson(null)}
                className="rounded-lg px-3 py-2 text-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="mt-6 flex gap-3">
              <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                {selectedLesson.level}
              </span>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                ⏱ {selectedLesson.duration}
              </span>
            </div>

            <p className="mt-6 leading-7 text-slate-600 dark:text-slate-400">
              {selectedLesson.description}
            </p>

            <div className="mt-7 rounded-xl border border-sky-100 bg-sky-50 p-5 dark:border-sky-900 dark:bg-sky-950/40">
              <p className="text-sm font-semibold text-sky-800 dark:text-sky-300">
                Learning module
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                This module is currently presented as a prototype learning
                experience. Detailed lesson content can be added to this
                interface later.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedLesson(null)}
              className="mt-7 rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Quiz Modal */}
      {showQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-6 py-8">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl dark:bg-slate-900">
            {!quizFinished ? (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                      Polar Science Quiz
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                      Question {currentQuestion + 1} of{" "}
                      {quizQuestions.length}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={closeQuiz}
                    className="rounded-lg px-3 py-2 text-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                    aria-label="Close quiz"
                  >
                    ×
                  </button>
                </div>

                <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-sky-600 transition-all"
                    style={{
                      width: `${
                        ((currentQuestion + 1) / quizQuestions.length) * 100
                      }%`,
                    }}
                  />
                </div>

                <h3 className="mt-8 text-xl font-bold leading-8 text-slate-900 dark:text-white">
                  {quizQuestions[currentQuestion].question}
                </h3>

                <div className="mt-6 space-y-3">
                  {quizQuestions[currentQuestion].options.map(
                    (option, index) => {
                      const isSelected = selectedAnswer === index;
                      const isCorrect =
                        index === quizQuestions[currentQuestion].answer;

                      let optionClass =
                        "border-slate-200 hover:border-sky-300 hover:bg-sky-50 dark:border-slate-700 dark:hover:border-sky-700 dark:hover:bg-slate-800";

                      if (selectedAnswer !== null && isCorrect) {
                        optionClass =
                          "border-emerald-500 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/30";
                      } else if (isSelected) {
                        optionClass =
                          "border-red-500 bg-red-50 dark:border-red-700 dark:bg-red-950/30";
                      }

                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => handleQuizAnswer(index)}
                          disabled={selectedAnswer !== null}
                          className={`w-full rounded-xl border p-4 text-left text-sm font-medium transition ${optionClass}`}
                        >
                          <span className="mr-3 font-bold text-sky-600 dark:text-sky-400">
                            {String.fromCharCode(65 + index)}.
                          </span>
                          {option}
                        </button>
                      );
                    },
                  )}
                </div>

                {selectedAnswer !== null && (
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="mt-7 w-full rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-700"
                  >
                    {currentQuestion === quizQuestions.length - 1
                      ? "Finish Quiz"
                      : "Next Question →"}
                  </button>
                )}
              </>
            ) : (
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 text-3xl dark:bg-sky-950">
                  🎓
                </div>

                <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                  Quiz Completed
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                  Your Score
                </h2>

                <p className="mt-5 text-5xl font-bold text-sky-600 dark:text-sky-400">
                  {quizScore}/{quizQuestions.length}
                </p>

                <p className="mt-4 text-slate-500 dark:text-slate-400">
                  Thanks for participating in the Polar Science Quiz.
                </p>

                <button
                  type="button"
                  onClick={closeQuiz}
                  className="mt-8 rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-700"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}