"use client";

import { useState } from "react";
import Link from "next/link";

type FileStatus = "pending" | "approved" | "rejected";

type ResearcherFile = {
  id: number;
  title: string;
  fileName: string;
  researcher: string;
  email: string;
  institution: string;
  researchArea: string;
  submitted: string;
  status: FileStatus;
};

const initialFiles: ResearcherFile[] = [
  {
    id: 1,
    title: "Antarctic Climate Research Proposal",
    fileName: "antarctic-climate-proposal.pdf",
    researcher: "Rahul Kumar",
    email: "rahul.kumar@example.com",
    institution: "Indian Institute of Technology Delhi",
    researchArea: "Polar Climate Science",
    submitted: "29 Sep 2026",
    status: "pending",
  },
  {
    id: 2,
    title: "Southern Ocean Observation Report",
    fileName: "southern-ocean-report.pdf",
    researcher: "Priya Sharma",
    email: "priya.sharma@example.com",
    institution: "University of Delhi",
    researchArea: "Oceanography",
    submitted: "28 Sep 2026",
    status: "pending",
  },
  {
    id: 3,
    title: "Antarctic Biodiversity Dataset",
    fileName: "antarctic-biodiversity.pdf",
    researcher: "Arjun Singh",
    email: "arjun.singh@example.com",
    institution: "National Institute of Oceanography",
    researchArea: "Polar Biology",
    submitted: "27 Sep 2026",
    status: "approved",
  },
  {
    id: 4,
    title: "Himadri Station Research Report",
    fileName: "himadri-research-report.pdf",
    researcher: "Neha Verma",
    email: "neha.verma@example.com",
    institution: "Jawaharlal Nehru University",
    researchArea: "Atmospheric Science",
    submitted: "26 Sep 2026",
    status: "approved",
  },
];

const researchers = [
  {
    name: "Rahul Kumar",
    email: "rahul.kumar@example.com",
    institution: "IIT Delhi",
    area: "Polar Climate Science",
  },
  {
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    institution: "University of Delhi",
    area: "Oceanography",
  },
  {
    name: "Arjun Singh",
    email: "arjun.singh@example.com",
    institution: "National Institute of Oceanography",
    area: "Polar Biology",
  },
  {
    name: "Neha Verma",
    email: "neha.verma@example.com",
    institution: "Jawaharlal Nehru University",
    area: "Atmospheric Science",
  },
];

export default function AdminDashboard() {
  const [files, setFiles] = useState<ResearcherFile[]>(initialFiles);
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pendingFiles = files.filter(
    (file) => file.status === "pending"
  );

  const approvedFiles = files.filter(
    (file) => file.status === "approved"
  );

  const rejectedFiles = files.filter(
    (file) => file.status === "rejected"
  );

  function approveFile(id: number) {
    setFiles((currentFiles) =>
      currentFiles.map((file) =>
        file.id === id
          ? {
              ...file,
              status: "approved",
            }
          : file
      )
    );
  }

  function rejectFile(id: number) {
    setFiles((currentFiles) =>
      currentFiles.map((file) =>
        file.id === id
          ? {
              ...file,
              status: "rejected",
            }
          : file
      )
    );
  }

  function viewDocument(file: ResearcherFile) {
    alert(
      `Document: ${file.fileName}\n\nResearcher: ${file.researcher}\nInstitution: ${file.institution}`
    );
  }

  function selectSection(section: string) {
    setActiveSection(section);
    setMobileMenuOpen(false);
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">

      {/* TOP NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
        <div className="flex h-16 items-center justify-between px-5 lg:px-8">

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
            >
              ☰
            </button>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-white">
              ❄
            </div>

            <div>
              <p className="text-sm font-bold tracking-wide">
                POLAR SCIENCE
              </p>

              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                Administration
              </p>
            </div>

          </div>

          <div className="flex items-center gap-3">

            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold">
            
             Admin
              </p>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Administrator
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              AD
            </div>

          </div>

        </div>
      </header>

      <div className="flex">

        {/* DESKTOP SIDEBAR */}
        <aside className="hidden min-h-[calc(100vh-64px)] w-64 shrink-0 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:block">

          <Sidebar
            activeSection={activeSection}
            onSelect={selectSection}
          />

        </aside>

        {/* MOBILE SIDEBAR */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">

            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileMenuOpen(false)}
            />

            <aside className="relative h-full w-72 bg-white shadow-xl dark:bg-slate-900">
              <Sidebar
                activeSection={activeSection}
                onSelect={selectSection}
              />
            </aside>

          </div>
        )}

        {/* MAIN CONTENT */}
        <section className="min-w-0 flex-1 p-5 lg:p-10">

          <div className="mx-auto max-w-7xl">

            {/* PAGE HEADER */}
            <div className="mb-10">

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
                NCPOR / Administration
              </p>

              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                {activeSection}
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                Review researcher submissions, verify documents and manage
                approved scientific files.
              </p>

            </div>

            {/* =========================================
                DASHBOARD
            ========================================= */}
            {activeSection === "Dashboard" && (
              <div>

                {/* STAT CARDS */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                  <StatCard
                    label="Pending Review"
                    value={pendingFiles.length}
                    description="Requires verification"
                    icon="◷"
                    iconClass="bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
                  />

                  <StatCard
                    label="Approved Files"
                    value={approvedFiles.length}
                    description="Verified documents"
                    icon="✓"
                    iconClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                  />

                  <StatCard
                    label="Total Submissions"
                    value={files.length}
                    description="All submitted files"
                    icon="▤"
                    iconClass="bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400"
                  />

                  <StatCard
                    label="Researchers"
                    value={researchers.length}
                    description="Registered researchers"
                    icon="◉"
                    iconClass="bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400"
                  />

                </div>

                {/* PENDING SECTION */}
                <section className="mt-10">

                  <div className="mb-5 flex items-end justify-between">

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Verification Queue
                      </p>

                      <h2 className="mt-1 text-xl font-bold">
                        Pending Files
                      </h2>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        selectSection("Pending Files")
                      }
                      className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                    >
                      View all →
                    </button>

                  </div>

                  <div className="space-y-4">

                    {pendingFiles.slice(0, 3).map((file) => (
                      <DocumentCard
                        key={file.id}
                        file={file}
                        onApprove={approveFile}
                        onReject={rejectFile}
                        onView={viewDocument}
                      />
                    ))}

                  </div>

                </section>

              </div>
            )}

            {/* =========================================
                PENDING FILES
            ========================================= */}
            {activeSection === "Pending Files" && (
              <div>

                {pendingFiles.length === 0 ? (
                  <EmptyState
                    title="No pending files"
                    description="All researcher submissions have been reviewed."
                  />
                ) : (
                  <div className="space-y-5">

                    {pendingFiles.map((file) => (
                      <DocumentCard
                        key={file.id}
                        file={file}
                        onApprove={approveFile}
                        onReject={rejectFile}
                        onView={viewDocument}
                      />
                    ))}

                  </div>
                )}

              </div>
            )}

            {/* =========================================
                APPROVED FILES
            ========================================= */}
            {activeSection === "Approved Files" && (
              <div>

                {approvedFiles.length === 0 ? (
                  <EmptyState
                    title="No approved files"
                    description="Approved researcher documents will appear here."
                  />
                ) : (
                  <div className="space-y-5">

                    {approvedFiles.map((file) => (
                      <ApprovedFileCard
                        key={file.id}
                        file={file}
                        onView={viewDocument}
                      />
                    ))}

                  </div>
                )}

              </div>
            )}

            {/* =========================================
                RESEARCHERS
            ========================================= */}
            {activeSection === "Researchers" && (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

                {researchers.map((researcher) => (
                  <div
                    key={researcher.email}
                    className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
                  >

                    <div className="flex items-center justify-between">

                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                        {researcher.name
                          .split(" ")
                          .map((word) => word[0])
                          .join("")}
                      </div>

                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                        Active
                      </span>

                    </div>

                    <h3 className="mt-5 text-lg font-semibold">
                      {researcher.name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {researcher.email}
                    </p>

                    <div className="mt-5 space-y-3 border-t border-slate-100 pt-5 dark:border-slate-800">

                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-400">
                          Institution
                        </p>

                        <p className="mt-1 text-sm font-medium">
                          {researcher.institution}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-400">
                          Research Area
                        </p>

                        <p className="mt-1 text-sm font-medium">
                          {researcher.area}
                        </p>
                      </div>

                    </div>

                    <button
                      type="button"
                      className="mt-6 w-full rounded-lg border border-slate-200 py-2.5 text-sm font-semibold transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                    >
                      View Researcher Profile
                    </button>

                  </div>
                ))}

              </div>
            )}

            {/* =========================================
                SETTINGS
            ========================================= */}
            {activeSection === "Settings" && (
              <div className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">

                <h2 className="text-xl font-bold">
                  Admin Settings
                </h2>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Manage administrator profile information.
                </p>

                <div className="mt-8 space-y-5">

                  <div>
                    <label
                      htmlFor="adminName"
                      className="text-sm font-semibold"
                    >
                      Administrator Name
                    </label>

                    <input
                      id="adminName"
                      defaultValue="NCPOR Admin"
                      className="mt-2 w-full rounded-lg border border-slate-300 bg-transparent px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:border-slate-700"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="adminEmail"
                      className="text-sm font-semibold"
                    >
                      Email
                    </label>

                    <input
                      id="adminEmail"
                      defaultValue="admin@ncpor.gov.in"
                      className="mt-2 w-full rounded-lg border border-slate-300 bg-transparent px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:border-slate-700"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      alert("Settings saved successfully.")
                    }
                    className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                  >
                    Save Changes
                  </button>

                </div>

              </div>
            )}

          </div>

        </section>

      </div>
    </main>
  );
}


/* =========================================================
   SIDEBAR
========================================================= */

function Sidebar({
  activeSection,
  onSelect,
}: {
  activeSection: string;
  onSelect: (section: string) => void;
}) {
  const menuItems = [
    {
      name: "Dashboard",
      icon: "▦",
    },
    {
      name: "Pending Files",
      icon: "◷",
    },
    {
      name: "Approved Files",
      icon: "✓",
    },
    {
      name: "Researchers",
      icon: "◉",
    },
    {
      name: "Settings",
      icon: "⚙",
    },
  ];

  return (
    <div className="flex h-full flex-col p-5">

      <div className="mb-8">

        <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          Administration
        </p>

        <p className="mt-2 px-3 text-xs leading-5 text-slate-500 dark:text-slate-400">
          Research document verification and management.
        </p>

      </div>

      <nav className="space-y-1">

        {menuItems.map((item) => (
          <button
            key={item.name}
            type="button"
            onClick={() => onSelect(item.name)}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium transition ${
              activeSection === item.name
                ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300"
                : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
            }`}
          >
            <span className="w-5 text-center">
              {item.icon}
            </span>

            {item.name}

            {item.name === "Pending Files" && (
              <span className="ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                2
              </span>
            )}

          </button>
        ))}

      </nav>

      <div className="mt-auto">

        <div className="my-5 border-t border-slate-200 dark:border-slate-800" />

        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          ← Back to Portal
        </Link>

        <Link
          href="/login"
          className="mt-1 flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950/20"
        >
          ↪ Logout
        </Link>

      </div>

    </div>
  );
}


/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  label,
  value,
  description,
  icon,
  iconClass,
}: {
  label: string;
  value: number;
  description: string;
  icon: string;
  iconClass: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {label}
          </p>

          <p className="mt-3 text-3xl font-bold">
            {value}
          </p>

          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${iconClass}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}


/* =========================================================
   PENDING DOCUMENT CARD
========================================================= */

function DocumentCard({
  file,
  onApprove,
  onReject,
  onView,
}: {
  file: ResearcherFile;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onView: (file: ResearcherFile) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">

      <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">

        {/* DOCUMENT INFORMATION */}
        <div className="flex min-w-0 gap-4">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-xl dark:bg-amber-950/30">
            📄
          </div>

          <div className="min-w-0 flex-1">

            <div className="flex flex-wrap items-center gap-2">

              <h3 className="font-semibold">
                {file.title}
              </h3>

              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                Pending
              </span>

            </div>

            <p className="mt-1 break-all text-sm text-slate-500">
              {file.fileName}
            </p>

            {/* RESEARCHER DETAILS */}
            <div className="mt-5 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/70">

              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                Researcher Details
              </p>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">

                <Detail
                  label="Researcher"
                  value={file.researcher}
                />

                <Detail
                  label="Email"
                  value={file.email}
                />

                <Detail
                  label="Institution"
                  value={file.institution}
                />

                <Detail
                  label="Research Area"
                  value={file.researchArea}
                />

                <Detail
                  label="Submitted"
                  value={file.submitted}
                />

              </div>

            </div>

          </div>

        </div>

        {/* ACTIONS */}
        <div className="flex shrink-0 flex-wrap gap-2 xl:w-40 xl:flex-col">

          <button
            type="button"
            onClick={() => onView(file)}
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            View Document
          </button>

          <button
            type="button"
            onClick={() => onApprove(file.id)}
            className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            ✓ Approve
          </button>

          <button
            type="button"
            onClick={() => onReject(file.id)}
            className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/20"
          >
            Reject
          </button>

        </div>

      </div>

    </div>
  );
}


/* =========================================================
   APPROVED DOCUMENT CARD
========================================================= */

function ApprovedFileCard({
  file,
  onView,
}: {
  file: ResearcherFile;
  onView: (file: ResearcherFile) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex min-w-0 gap-4">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-lg text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
            ✓
          </div>

          <div className="min-w-0">

            <div className="flex flex-wrap items-center gap-2">

              <h3 className="font-semibold">
                {file.title}
              </h3>

              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                Approved
              </span>

            </div>

            <p className="mt-1 break-all text-sm text-slate-500">
              {file.fileName}
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

              <Detail
                label="Researcher"
                value={file.researcher}
              />

              <Detail
                label="Email"
                value={file.email}
              />

              <Detail
                label="Institution"
                value={file.institution}
              />

              <Detail
                label="Research Area"
                value={file.researchArea}
              />

            </div>

          </div>

        </div>

        <button
          type="button"
          onClick={() => onView(file)}
          className="shrink-0 rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          View Document
        </button>

      </div>

    </div>
  );
}


/* =========================================================
   DETAIL
========================================================= */

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">

      <p className="text-[10px] uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 wrap-break-word text-sm font-medium">
        {value}
      </p>

    </div>
  );
}


/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">

      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-500 dark:bg-slate-800">
        ✓
      </div>

      <h3 className="mt-5 font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        {description}
      </p>

    </div>
  );
}