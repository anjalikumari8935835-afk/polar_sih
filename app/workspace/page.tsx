"use client";


import { useEffect, useState } from "react";

type DocumentStatus = "Pending Verification" | "Verified" | "Rejected";

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
  status: DocumentStatus;
  submittedAt: string;
};

type ResearchFolder = {
  id: string;
  name: string;
  createdAt: string;
};

type ConnectionNotification = {
  id: string;
  userName: string;
  userEmail: string;
  receivedAt: string;
};

const STORAGE_DOCUMENTS = "polarResearchDocuments";
const STORAGE_FOLDERS = "polarResearchFolders";
const STORAGE_RESEARCHER_NAME = "polarResearcherName";
const STORAGE_RESEARCHER_EMAIL = "polarResearcherEmail";
const STORAGE_SHOW_EMAIL = "polarResearcherShowEmail";
const STORAGE_CONNECTIONS = "polarResearcherConnections";

const documentTypes = [
  "Research Paper",
  "Expedition Report",
  "Technical Report",
  "Field Report",
  "Dataset Documentation",
  "Research Proposal",
  "Conference Paper",
  "Other",
];

export default function WorkspacePage() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  const [activeSection, setActiveSection] = useState<
    "dashboard" | "submit" | "folders" | "documents" | "connections"
  >("dashboard");

  const [documents, setDocuments] = useState<ResearchDocument[]>([]);
  const [folders, setFolders] = useState<ResearchFolder[]>([]);

  const [showFolderForm, setShowFolderForm] = useState(false);
  const [folderName, setFolderName] = useState("");

  const [showSubmitForm, setShowSubmitForm] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    documentType: "",
    expeditionYear: "",
    expeditionName: "",
    expeditionLocation: "",
    department: "",
    institution: "",
    folderId: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  /* ---------------------------------------------------------------------- */
  /* Connections state                                                      */
  /* ---------------------------------------------------------------------- */

  const [researcherName, setResearcherName] = useState("");
  const [researcherEmail, setResearcherEmail] = useState("");
  const [showEmailToUsers, setShowEmailToUsers] = useState(true);
  const [connections, setConnections] = useState<
    ConnectionNotification[]
  >([]);

  const [emailSaved, setEmailSaved] = useState(false);

  /* ---------------------------------------------------------------------- */
  /* Authorization + stored data                                           */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    const loggedIn =
      localStorage.getItem("polarLoggedIn") === "true";

    const role = localStorage.getItem("polarRole");

    if (!loggedIn || role !== "researcher") {
      setAuthorized(false);
      window.location.href = "/";
      return;
    }

    setAuthorized(true);

    const storedDocuments =
      localStorage.getItem(STORAGE_DOCUMENTS);

    const storedFolders =
      localStorage.getItem(STORAGE_FOLDERS);

    const storedResearcherName =
      localStorage.getItem(STORAGE_RESEARCHER_NAME);

    const storedResearcherEmail =
      localStorage.getItem(STORAGE_RESEARCHER_EMAIL);

    const storedShowEmail =
      localStorage.getItem(STORAGE_SHOW_EMAIL);

    const storedConnections =
      localStorage.getItem(STORAGE_CONNECTIONS);

    if (storedDocuments) {
      try {
        setDocuments(JSON.parse(storedDocuments));
      } catch {
        setDocuments([]);
      }
    }

    if (storedFolders) {
      try {
        setFolders(JSON.parse(storedFolders));
      } catch {
        setFolders([]);
      }
    }

    if (storedResearcherName) {
      setResearcherName(storedResearcherName);
    }

    if (storedResearcherEmail) {
      setResearcherEmail(storedResearcherEmail);
    }

    if (storedShowEmail !== null) {
      setShowEmailToUsers(storedShowEmail === "true");
    }

    if (storedConnections) {
      try {
        setConnections(JSON.parse(storedConnections));
      } catch {
        setConnections([]);
      }
    }
  }, []);

  useEffect(() => {
    if (authorized) {
      localStorage.setItem(
        STORAGE_DOCUMENTS,
        JSON.stringify(documents)
      );
    }
  }, [documents, authorized]);

  useEffect(() => {
    if (authorized) {
      localStorage.setItem(
        STORAGE_FOLDERS,
        JSON.stringify(folders)
      );
    }
  }, [folders, authorized]);

  useEffect(() => {
    if (authorized) {
      localStorage.setItem(
        STORAGE_CONNECTIONS,
        JSON.stringify(connections)
      );
    }
  }, [connections, authorized]);

  /* ---------------------------------------------------------------------- */
  /* Statistics                                                             */
  /* ---------------------------------------------------------------------- */

  const pendingDocuments = documents.filter(
    (document) =>
      document.status === "Pending Verification"
  );

  const verifiedDocuments = documents.filter(
    (document) => document.status === "Verified"
  );

  /* ---------------------------------------------------------------------- */
  /* Folder functions                                                       */
  /* ---------------------------------------------------------------------- */

  const handleCreateFolder = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    const cleanName = folderName.trim();

    if (!cleanName) {
      return;
    }

    const newFolder: ResearchFolder = {
      id: crypto.randomUUID(),
      name: cleanName,
      createdAt: new Date().toLocaleDateString(),
    };

    setFolders((current) => [
      ...current,
      newFolder,
    ]);

    setFolderName("");
    setShowFolderForm(false);
  };

  /* ---------------------------------------------------------------------- */
  /* Document functions                                                     */
  /* ---------------------------------------------------------------------- */

  const handleFormChange = (
    field: keyof typeof formData,
    value: string
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0] || null;

    setSelectedFile(file);

    if (file && !formData.title) {
      const fileNameWithoutExtension =
        file.name.replace(/\.[^/.]+$/, "");

      setFormData((current) => ({
        ...current,
        title: fileNameWithoutExtension,
      }));
    }
  };

  const handleSubmitDocument = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (
      !formData.title ||
      !formData.documentType ||
      !formData.expeditionYear ||
      !formData.expeditionName ||
      !formData.expeditionLocation ||
      !formData.department ||
      !formData.institution ||
      !selectedFile
    ) {
      alert(
        "Please fill all required fields and select a document."
      );
      return;
    }

    const newDocument: ResearchDocument = {
      id: crypto.randomUUID(),
      title: formData.title,
      documentType: formData.documentType,
      expeditionYear: formData.expeditionYear,
      expeditionName: formData.expeditionName,
      expeditionLocation:
        formData.expeditionLocation,
      department: formData.department,
      institution: formData.institution,
      folderId: formData.folderId,
      fileName: selectedFile.name,
      fileSize: formatFileSize(
        selectedFile.size
      ),
      status: "Pending Verification",
      submittedAt:
        new Date().toLocaleDateString(),
    };

    setDocuments((current) => [
      newDocument,
      ...current,
    ]);

    setFormData({
      title: "",
      documentType: "",
      expeditionYear: "",
      expeditionName: "",
      expeditionLocation: "",
      department: "",
      institution: "",
      folderId: "",
    });

    setSelectedFile(null);
    setShowSubmitForm(false);
    setActiveSection("documents");

    alert(
      "Research document submitted successfully. It is now pending verification."
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";

    const units = [
      "Bytes",
      "KB",
      "MB",
      "GB",
    ];

    const index = Math.floor(
      Math.log(bytes) / Math.log(1024)
    );

    return `${(
      bytes /
      Math.pow(1024, index)
    ).toFixed(1)} ${units[index]}`;
  };

  const getFolderName = (
    folderId: string
  ) => {
    const folder = folders.find(
      (item) => item.id === folderId
    );

    return folder?.name || "Unorganized";
  };

  const getStatusClass = (
    status: DocumentStatus
  ) => {
    if (status === "Verified") {
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300";
    }

    if (status === "Rejected") {
      return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300";
    }

    return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300";
  };

  /* ---------------------------------------------------------------------- */
  /* Connection functions                                                   */
  /* ---------------------------------------------------------------------- */

  const handleSaveContact = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    const cleanName = researcherName.trim();
    const cleanEmail = researcherEmail.trim();

    if (!cleanName) {
      alert("Please enter your researcher name.");
      return;
    }

    if (!cleanEmail) {
      alert(
        "Please enter your email address."
      );
      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        cleanEmail
      )
    ) {
      alert(
        "Please enter a valid email address."
      );
      return;
    }

    localStorage.setItem(
      STORAGE_RESEARCHER_NAME,
      cleanName
    );

    localStorage.setItem(
      STORAGE_RESEARCHER_EMAIL,
      cleanEmail
    );

    localStorage.setItem(
      STORAGE_SHOW_EMAIL,
      String(showEmailToUsers)
    );

    setResearcherName(cleanName);
    setResearcherEmail(cleanEmail);
    setEmailSaved(true);

    setTimeout(() => {
      setEmailSaved(false);
    }, 3000);
  };

  /* ---------------------------------------------------------------------- */
  /* Loading / authorization                                                */
  /* ---------------------------------------------------------------------- */

  if (authorized === null) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600" />

          <p className="text-sm text-slate-600 dark:text-slate-400">
            Loading researcher workspace...
          </p>
        </div>
      </main>
    );
  }

  if (!authorized) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">

      {/* ------------------------------------------------------------------ */}
      {/* Hero                                                               */}
      {/* ------------------------------------------------------------------ */}

      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                  Researcher Workspace
                </span>
              </div>

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Research Workspace
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400">
                Submit, organize and manage your polar research
                documents and researcher connections in one
                dedicated workspace.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowSubmitForm(true);
                setActiveSection("submit");
              }}
              className="rounded-full bg-sky-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-sky-700"
            >
              + Submit Research Document
            </button>

          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Workspace Navigation                                               */}
      {/* ------------------------------------------------------------------ */}

      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="flex gap-2 overflow-x-auto py-3">

            <WorkspaceTab
              active={
                activeSection === "dashboard"
              }
              onClick={() =>
                setActiveSection("dashboard")
              }
              label="Dashboard"
              icon="▦"
            />

            <WorkspaceTab
              active={
                activeSection === "documents"
              }
              onClick={() =>
                setActiveSection("documents")
              }
              label="My Documents"
              icon="📄"
            />

            <WorkspaceTab
              active={
                activeSection === "folders"
              }
              onClick={() =>
                setActiveSection("folders")
              }
              label="Folders"
              icon="📁"
            />

            <WorkspaceTab
              active={
                activeSection === "submit"
              }
              onClick={() => {
                setActiveSection("submit");
                setShowSubmitForm(true);
              }}
              label="Submit Document"
              icon="+"
            />

            <WorkspaceTab
              active={
                activeSection === "connections"
              }
              onClick={() =>
                setActiveSection("connections")
              }
              label="Connections"
              icon="🔗"
            />

          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* ---------------------------------------------------------------- */}
        {/* Dashboard                                                         */}
        {/* ---------------------------------------------------------------- */}

        {activeSection === "dashboard" && (
          <section>

            <div className="mb-8">
              <h2 className="text-2xl font-bold">
                Workspace Overview
              </h2>

              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Manage your research documents, folders and
                researcher connections.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <StatCard
                title="Total Documents"
                value={documents.length}
                icon="📄"
              />

              <StatCard
                title="Pending Verification"
                value={pendingDocuments.length}
                icon="⏳"
              />

              <StatCard
                title="Verified Documents"
                value={verifiedDocuments.length}
                icon="✓"
              />

              <StatCard
                title="Connections"
                value={connections.length}
                icon="🔗"
              />

            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-4">

              <QuickAction
                icon="📤"
                title="Submit Research"
                description="Upload a research document with expedition and institution information."
                onClick={() => {
                  setActiveSection("submit");
                  setShowSubmitForm(true);
                }}
              />

              <QuickAction
                icon="📁"
                title="Create Folder"
                description="Organize research documents by department, project or expedition."
                onClick={() => {
                  setActiveSection("folders");
                  setShowFolderForm(true);
                }}
              />

              <QuickAction
                icon="📚"
                title="View Documents"
                description="Review your submitted research documents and verification status."
                onClick={() =>
                  setActiveSection("documents")
                }
              />

              <QuickAction
                icon="🔗"
                title="Connections"
                description="Manage your public contact email and view connection notifications."
                onClick={() =>
                  setActiveSection("connections")
                }
              />

            </div>

            <div className="mt-10">

              <div className="mb-5 flex items-center justify-between">

                <div>
                  <h2 className="text-xl font-bold">
                    Recent Research Documents
                  </h2>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Your latest submissions.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setActiveSection("documents")
                  }
                  className="text-sm font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400"
                >
                  View all →
                </button>

              </div>

              {documents.length === 0 ? (
                <EmptyState
                  icon="📄"
                  title="No research documents yet"
                  description="Submit your first research document to start building your workspace."
                  buttonText="Submit Document"
                  onClick={() => {
                    setActiveSection("submit");
                    setShowSubmitForm(true);
                  }}
                />
              ) : (
                <div className="space-y-3">
                  {documents
                    .slice(0, 4)
                    .map((document) => (
                      <DocumentRow
                        key={document.id}
                        document={document}
                        folderName={getFolderName(
                          document.folderId
                        )}
                      />
                    ))}
                </div>
              )}

            </div>

          </section>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Submit Document                                                  */}
        {/* ---------------------------------------------------------------- */}

        {activeSection === "submit" && (
          <section>

            <div className="mb-8">
              <h2 className="text-2xl font-bold">
                Submit Research Document
              </h2>

              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Provide the required research and expedition
                information before submitting your document.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">

              <form
                onSubmit={handleSubmitDocument}
                className="space-y-8"
              >

                {/* Document Information */}
                <div>
                  <h3 className="mb-5 text-lg font-bold">
                    Document Information
                  </h3>

                  <div className="grid gap-5 md:grid-cols-2">

                    <FormField
                      label="Document Title"
                      required
                      value={formData.title}
                      onChange={(value) =>
                        handleFormChange(
                          "title",
                          value
                        )
                      }
                      placeholder="Enter research document title"
                    />

                    <div>
                      <label className="mb-2 block text-sm font-semibold">
                        Document Type *
                      </label>

                      <select
                        value={
                          formData.documentType
                        }
                        onChange={(event) =>
                          handleFormChange(
                            "documentType",
                            event.target.value
                          )
                        }
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-sky-950"
                      >
                        <option value="">
                          Select document type
                        </option>

                        {documentTypes.map(
                          (type) => (
                            <option
                              key={type}
                              value={type}
                            >
                              {type}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                  </div>
                </div>

                {/* Expedition Information */}
                <div className="border-t border-slate-200 pt-8 dark:border-slate-800">

                  <h3 className="mb-5 text-lg font-bold">
                    Expedition Information
                  </h3>

                  <div className="grid gap-5 md:grid-cols-2">

                    <FormField
                      label="Year of Expedition"
                      required
                      type="number"
                      value={
                        formData.expeditionYear
                      }
                      onChange={(value) =>
                        handleFormChange(
                          "expeditionYear",
                          value
                        )
                      }
                      placeholder="e.g. 2026"
                    />

                    <FormField
                      label="Expedition Name / Number"
                      required
                      value={
                        formData.expeditionName
                      }
                      onChange={(value) =>
                        handleFormChange(
                          "expeditionName",
                          value
                        )
                      }
                      placeholder="e.g. SOE-2026"
                    />

                    <div className="md:col-span-2">
                      <FormField
                        label="Expedition Location"
                        required
                        value={
                          formData.expeditionLocation
                        }
                        onChange={(value) =>
                          handleFormChange(
                            "expeditionLocation",
                            value
                          )
                        }
                        placeholder="e.g. Southern Ocean / Antarctica / Arctic"
                      />
                    </div>

                  </div>
                </div>

                {/* Research Information */}
                <div className="border-t border-slate-200 pt-8 dark:border-slate-800">

                  <h3 className="mb-5 text-lg font-bold">
                    Research Information
                  </h3>

                  <div className="grid gap-5 md:grid-cols-2">

                    <FormField
                      label="Department / Research Group"
                      required
                      value={
                        formData.department
                      }
                      onChange={(value) =>
                        handleFormChange(
                          "department",
                          value
                        )
                      }
                      placeholder="e.g. Climate Research Group"
                    />

                    <FormField
                      label="Institution / Organization"
                      required
                      value={
                        formData.institution
                      }
                      onChange={(value) =>
                        handleFormChange(
                          "institution",
                          value
                        )
                      }
                      placeholder="e.g. NCPOR"
                    />

                  </div>
                </div>

                {/* Folder */}
                <div className="border-t border-slate-200 pt-8 dark:border-slate-800">

                  <h3 className="mb-2 text-lg font-bold">
                    Organize Document
                  </h3>

                  <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
                    Select an existing folder or leave it
                    unorganized.
                  </p>

                  <div className="flex flex-col gap-3 sm:flex-row">

                    <select
                      value={formData.folderId}
                      onChange={(event) =>
                        handleFormChange(
                          "folderId",
                          event.target.value
                        )
                      }
                      className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    >
                      <option value="">
                        No folder / Unorganized
                      </option>

                      {folders.map(
                        (folder) => (
                          <option
                            key={folder.id}
                            value={folder.id}
                          >
                            {folder.name}
                          </option>
                        )
                      )}
                    </select>

                    <button
                      type="button"
                      onClick={() =>
                        setShowFolderForm(true)
                      }
                      className="rounded-xl border border-sky-200 px-5 py-3 text-sm font-semibold text-sky-700 hover:bg-sky-50 dark:border-sky-800 dark:text-sky-300 dark:hover:bg-sky-950"
                    >
                      + New Folder
                    </button>

                  </div>
                </div>

                {/* File Upload */}
                <div className="border-t border-slate-200 pt-8 dark:border-slate-800">

                  <h3 className="mb-2 text-lg font-bold">
                    Research Document
                  </h3>

                  <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
                    Upload the research paper, report or related
                    document.
                  </p>

                  <label className="block cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 p-8 text-center transition hover:border-sky-400 hover:bg-sky-50/50 dark:border-slate-700 dark:hover:border-sky-600 dark:hover:bg-sky-950/20">

                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    <div className="text-4xl">
                      📄
                    </div>

                    {selectedFile ? (
                      <>
                        <p className="mt-3 font-semibold text-slate-900 dark:text-white">
                          {selectedFile.name}
                        </p>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          {formatFileSize(
                            selectedFile.size
                          )}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="mt-3 font-semibold">
                          Click to choose a document
                        </p>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          PDF, DOC, DOCX or TXT
                        </p>
                      </>
                    )}

                  </label>
                </div>

                {/* Verification Notice */}
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">

                  <div className="flex gap-3">
                    <span className="text-lg">
                      ℹ️
                    </span>

                    <div>
                      <p className="text-sm font-bold text-amber-800 dark:text-amber-300">
                        Verification required
                      </p>

                      <p className="mt-1 text-sm leading-6 text-amber-700 dark:text-amber-400">
                        Submitted documents will remain pending
                        until they are verified. AI content
                        generation becomes available only after
                        verification.
                      </p>
                    </div>
                  </div>

                </div>

                <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end dark:border-slate-800">

                  <button
                    type="button"
                    onClick={() =>
                      setActiveSection(
                        "dashboard"
                      )
                    }
                    className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="rounded-xl bg-sky-600 px-7 py-3 text-sm font-bold text-white transition hover:bg-sky-700"
                  >
                    Submit for Verification
                  </button>

                </div>

              </form>
            </div>
          </section>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Folders                                                          */}
        {/* ---------------------------------------------------------------- */}

        {activeSection === "folders" && (
          <section>

            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

              <div>
                <h2 className="text-2xl font-bold">
                  Research Folders
                </h2>

                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Organize your research documents by department,
                  project or expedition.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowFolderForm(true)
                }
                className="rounded-full bg-sky-600 px-5 py-3 text-sm font-bold text-white hover:bg-sky-700"
              >
                + Create Folder
              </button>

            </div>

            {folders.length === 0 ? (
              <EmptyState
                icon="📁"
                title="No folders created"
                description="Create folders to organize research papers by department, project or expedition."
                buttonText="Create Folder"
                onClick={() =>
                  setShowFolderForm(true)
                }
              />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                {folders.map((folder) => {

                  const folderDocuments =
                    documents.filter(
                      (document) =>
                        document.folderId ===
                        folder.id
                    );

                  return (
                    <div
                      key={folder.id}
                      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                    >

                      <div className="flex items-start justify-between">

                        <div className="text-4xl">
                          📁
                        </div>

                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {folderDocuments.length} files
                        </span>

                      </div>

                      <h3 className="mt-5 text-lg font-bold">
                        {folder.name}
                      </h3>

                      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                        Created{" "}
                        {folder.createdAt}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          setActiveSection(
                            "documents"
                          )
                        }
                        className="mt-5 text-sm font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400"
                      >
                        View documents →
                      </button>

                    </div>
                  );
                })}

              </div>
            )}

          </section>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Documents                                                        */}
        {/* ---------------------------------------------------------------- */}

        {activeSection === "documents" && (
          <section>

            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

              <div>
                <h2 className="text-2xl font-bold">
                  My Research Documents
                </h2>

                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Track your submitted research and verification
                  status.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveSection("submit");
                  setShowSubmitForm(true);
                }}
                className="rounded-full bg-sky-600 px-5 py-3 text-sm font-bold text-white hover:bg-sky-700"
              >
                + Submit Document
              </button>

            </div>

            {documents.length === 0 ? (
              <EmptyState
                icon="📄"
                title="No research documents"
                description="Your submitted research documents will appear here."
                buttonText="Submit Document"
                onClick={() => {
                  setActiveSection("submit");
                  setShowSubmitForm(true);
                }}
              />
            ) : (
              <div className="space-y-5">

                {documents.map(
                  (document) => (
                    <div
                      key={document.id}
                      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                    >

                      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                        <div className="min-w-0">

                          <div className="flex flex-wrap items-center gap-2">

                            <h3 className="text-lg font-bold">
                              {document.title}
                            </h3>

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                                document.status
                              )}`}
                            >
                              {document.status}
                            </span>

                          </div>

                          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            {document.documentType} •{" "}
                            {document.expeditionYear} •{" "}
                            {document.expeditionName}
                          </p>

                          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">

                            <InfoItem
                              label="Location"
                              value={
                                document.expeditionLocation
                              }
                            />

                            <InfoItem
                              label="Department / Group"
                              value={
                                document.department
                              }
                            />

                            <InfoItem
                              label="Institution"
                              value={
                                document.institution
                              }
                            />

                            <InfoItem
                              label="Folder"
                              value={getFolderName(
                                document.folderId
                              )}
                            />

                          </div>

                          <div className="mt-4 rounded-lg bg-slate-50 px-4 py-3 text-sm dark:bg-slate-950">

                            <span className="font-semibold">
                              File:
                            </span>{" "}

                            {document.fileName}

                            <span className="ml-2 text-slate-500">
                              ({document.fileSize})
                            </span>

                          </div>

                        </div>

                        <div className="flex shrink-0 flex-col gap-2">

                          {document.status ===
                          "Verified" ? (
                            <button
                              type="button"
                              onClick={() =>
                                alert(
                                  "AI Content Generator will be connected through the backend. Only verified documents can generate content."
                                )
                              }
                              className="rounded-xl bg-sky-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-sky-700"
                            >
                              ✨ Generate Content with AI
                            </button>
                          ) : (
                            <div className="rounded-xl border border-slate-200 px-5 py-3 text-center text-sm font-semibold text-slate-500 dark:border-slate-700 dark:text-slate-400">
                              AI generation unavailable
                            </div>
                          )}

                          <p className="text-center text-xs text-slate-400">
                            Submitted{" "}
                            {document.submittedAt}
                          </p>

                        </div>

                      </div>

                    </div>
                  )
                )}

              </div>
            )}

          </section>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Connections                                                      */}
        {/* ---------------------------------------------------------------- */}

        {activeSection === "connections" && (
          <section>

            <div className="mb-8">

              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-2xl dark:bg-sky-950">
                  🔗
                </div>

                <div>
                  <h2 className="text-2xl font-bold">
                    Researcher Connections
                  </h2>

                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    Manage how users can contact you through
                    the research portal.
                  </p>
                </div>
              </div>

            </div>

            {/* Public Contact Information */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">

              <div className="mb-6">

                <h3 className="text-lg font-bold">
                  Public Contact Information
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Add an email address that users can see and
                  use to contact you.
                </p>

              </div>

              <form
                onSubmit={handleSaveContact}
                className="space-y-6"
              >

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Researcher Name
                  </label>

                  <input
                    type="text"
                    value={researcherName}
                    onChange={(event) => {
                      setResearcherName(event.target.value);
                      setEmailSaved(false);
                    }}
                    placeholder="e.g. Dr. Anjali Kumar"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-sky-950"
                  />

                  <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    This name will be shown to users in Outreach → Connect.
                  </p>
                </div>

                <div>

                  <label className="mb-2 block text-sm font-semibold">
                    Researcher Email Address
                  </label>

                  <input
                    type="email"
                    value={researcherEmail}
                    onChange={(event) => {
                      setResearcherEmail(
                        event.target.value
                      );
                      setEmailSaved(false);
                    }}
                    placeholder="researcher@example.com"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-sky-950"
                  />

                  <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    This email can be displayed to users who
                    want to contact you about your research.
                  </p>

                </div>

                {/* Visibility Toggle */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">

                  <div className="flex items-center justify-between gap-4">

                    <div>
                      <p className="text-sm font-bold">
                        Show my email to users
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                        When enabled, users can see your public
                        research contact email.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setShowEmailToUsers(
                          (current) => !current
                        )
                      }
                      aria-label="Toggle email visibility"
                      className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                        showEmailToUsers
                          ? "bg-sky-600"
                          : "bg-slate-300 dark:bg-slate-700"
                      }`}
                    >
                      <span
                        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                          showEmailToUsers
                            ? "left-6"
                            : "left-1"
                        }`}
                      />
                    </button>

                  </div>

                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

                  <button
                    type="submit"
                    className="rounded-xl bg-sky-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-sky-700"
                  >
                    Save Contact Information
                  </button>

                  {emailSaved && (
                    <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                      ✓ Contact information saved
                    </span>
                  )}

                </div>

              </form>

            </div>

            {/* Notification Section */}
            <div className="mt-8">

              <div className="mb-5 flex items-end justify-between">

                <div>
                  <h3 className="text-xl font-bold">
                    Connection Notifications
                  </h3>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    See which users have contacted you.
                  </p>
                </div>

                {connections.length > 0 && (
                  <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                    {connections.length} notification
                    {connections.length !== 1
                      ? "s"
                      : ""}
                  </span>
                )}

              </div>

              {connections.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center dark:border-slate-700 dark:bg-slate-900">

                  <div className="text-5xl">
                    🔔
                  </div>

                  <h4 className="mt-5 text-lg font-bold">
                    No new connections
                  </h4>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                    When a user contacts you through your public
                    research email, a notification will appear
                    here.
                  </p>

                </div>
              ) : (
                <div className="space-y-3">

                  {connections.map(
                    (connection) => (
                      <div
                        key={connection.id}
                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                      >

                        <div className="flex items-start gap-4">

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xl dark:bg-sky-950">
                            👤
                          </div>

                          <div className="min-w-0 flex-1">

                            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

                              <h4 className="font-bold">
                                {connection.userName}
                              </h4>

                              <span className="text-xs text-slate-400">
                                {connection.receivedAt}
                              </span>

                            </div>

                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                              <span className="font-semibold">
                                {connection.userName}
                              </span>{" "}
                              sent you an email.
                            </p>

                            <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">
                              {connection.userEmail}
                            </p>

                          </div>

                          <div className="shrink-0">
                            <span className="flex h-2.5 w-2.5 rounded-full bg-sky-500" />
                          </div>

                        </div>

                      </div>
                    )
                  )}

                </div>
              )}

            </div>

            {/* Backend Information */}
            <div className="mt-8 rounded-2xl border border-sky-200 bg-sky-50 p-5 dark:border-sky-900 dark:bg-sky-950/30">

              <div className="flex gap-3">

                <span className="text-lg">
                  ℹ️
                </span>

                <div>

                  <p className="text-sm font-bold text-sky-800 dark:text-sky-300">
                    Connection system
                  </p>

                  <p className="mt-1 text-sm leading-6 text-sky-700 dark:text-sky-400">
                    This frontend is prepared for backend
                    integration. Actual email delivery, database
                    storage and incoming connection notifications
                    will be handled by the backend service.
                  </p>

                  <p className="mt-2 text-xs text-sky-600 dark:text-sky-500">
                    Full message content is intentionally not
                    displayed in this workspace notification.
                  </p>

                </div>

              </div>

            </div>

          </section>
        )}

      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Create Folder Modal                                                */}
      {/* ------------------------------------------------------------------ */}

      {showFolderForm && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">

            <div className="mb-6 flex items-start justify-between">

              <div>
                <h3 className="text-xl font-bold">
                  Create Research Folder
                </h3>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Use folders to organize your research.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowFolderForm(false)
                }
                className="text-xl text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                ×
              </button>

            </div>

            <form
              onSubmit={handleCreateFolder}
              className="space-y-5"
            >

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Folder Name *
                </label>

                <input
                  type="text"
                  value={folderName}
                  onChange={(event) =>
                    setFolderName(
                      event.target.value
                    )
                  }
                  placeholder="e.g. Antarctic Climate Research"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950"
                  autoFocus
                />
              </div>

              <div className="flex gap-3">

                <button
                  type="button"
                  onClick={() =>
                    setShowFolderForm(false)
                  }
                  className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold dark:border-slate-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-sky-600 px-4 py-3 text-sm font-bold text-white hover:bg-sky-700"
                >
                  Create Folder
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </main>
  );
}

/* ========================================================================== */
/* Reusable Components                                                        */
/* ========================================================================== */

function WorkspaceTab({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
        active
          ? "bg-sky-600 text-white"
          : "text-slate-600 hover:bg-slate-100 hover:text-sky-600 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-sky-400"
      }`}
    >
      <span className="mr-2">
        {icon}
      </span>

      {label}
    </button>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

      <div className="flex items-center justify-between">

        <span className="text-2xl">
          {icon}
        </span>

        <span className="text-3xl font-bold">
          {value}
        </span>

      </div>

      <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
        {title}
      </p>

    </div>
  );
}

function QuickAction({
  icon,
  title,
  description,
  onClick,
}: {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-sky-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-sky-800"
    >

      <div className="text-3xl">
        {icon}
      </div>

      <h3 className="mt-4 font-bold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
        {description}
      </p>

      <span className="mt-4 block text-sm font-semibold text-sky-600 group-hover:text-sky-700 dark:text-sky-400">
        Open →
      </span>

    </button>
  );
}

function EmptyState({
  icon,
  title,
  description,
  buttonText,
  onClick,
}: {
  icon: string;
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center dark:border-slate-700 dark:bg-slate-900">

      <div className="text-5xl">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-bold">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
        {description}
      </p>

      <button
        type="button"
        onClick={onClick}
        className="mt-6 rounded-xl bg-sky-600 px-5 py-3 text-sm font-bold text-white hover:bg-sky-700"
      >
        {buttonText}
      </button>

    </div>
  );
}

function FormField({
  label,
  required,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-semibold">
        {label}{" "}
        {required && "*"}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-sky-950"
      />

    </div>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>

      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 font-medium text-slate-700 dark:text-slate-300">
        {value}
      </p>

    </div>
  );
}

function DocumentRow({
  document,
  folderName,
}: {
  document: ResearchDocument;
  folderName: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div className="min-w-0">

          <div className="flex flex-wrap items-center gap-2">

            <h3 className="font-bold">
              {document.title}
            </h3>

            <span
              className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                document.status ===
                "Verified"
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                  : document.status ===
                    "Rejected"
                  ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                  : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
              }`}
            >
              {document.status}
            </span>

          </div>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {document.expeditionName} •{" "}
            {document.expeditionYear} •{" "}
            {folderName}
          </p>

        </div>

        <span className="text-xs text-slate-400">
          {document.submittedAt}
        </span>

      </div>

    </div>
  );
}