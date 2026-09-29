"use client";

import { useState } from "react";
import Link from "next/link";

type Role = "user" | "researcher" | "admin";

export default function LoginPage() {
  const [role, setRole] = useState<Role>("user");
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [institution, setInstitution] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    localStorage.setItem("polarLoggedIn", "true");
    localStorage.setItem("polarRole", role);

    if (isSignup) {
      alert(
        `${
          role === "user"
            ? "Public User"
            : role === "researcher"
            ? "Researcher"
            : "Admin"
        } account created successfully.`
      );

      if (role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/";
      }

      return;
    }

    if (role === "admin") {
      alert("Admin login successful.");
      window.location.href = "/admin";
      return;
    }

    if (role === "researcher") {
      alert("Researcher login successful.");
      window.location.href = "/";
      return;
    }

    alert("Public User login successful.");
    window.location.href = "/";
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <section className="flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
          <div className="grid lg:grid-cols-2">

            {/* LEFT SIDE */}
            <div className="bg-slate-950 p-8 text-white sm:p-12">

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-600 text-xl">
                ❄
              </div>

              <p className="mt-10 text-sm font-semibold uppercase tracking-[0.2em] text-sky-400">
                Polar Science Portal
              </p>

              <h1 className="mt-4 text-4xl font-bold leading-tight">
                Explore India&apos;s Polar Science
              </h1>

              <p className="mt-6 leading-7 text-slate-300">
                Access scientific datasets, visualizations, educational
                resources, research opportunities and polar science updates.
              </p>

              <div className="mt-10 space-y-6">

                <div className="flex gap-4">
                  <div className="text-xl">📊</div>

                  <div>
                    <h3 className="font-semibold">
                      Explore Scientific Data
                    </h3>

                    <p className="mt-1 text-sm text-slate-400">
                      Discover polar datasets and visualizations.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-xl">🎓</div>

                  <div>
                    <h3 className="font-semibold">
                      Learn &amp; Discover
                    </h3>

                    <p className="mt-1 text-sm text-slate-400">
                      Explore educational polar science resources.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-xl">🔬</div>

                  <div>
                    <h3 className="font-semibold">
                      Researcher Access
                    </h3>

                    <p className="mt-1 text-sm text-slate-400">
                      Access research-oriented features.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-xl">🛡️</div>

                  <div>
                    <h3 className="font-semibold">
                      Administration
                    </h3>

                    <p className="mt-1 text-sm text-slate-400">
                      Review and manage researcher submissions.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="bg-white p-8 dark:bg-slate-900 sm:p-12">
              <div className="mx-auto max-w-md">

                {/* HEADER */}
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                    Account Access
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                    {isSignup ? "Create your account" : "Welcome back"}
                  </h2>

                  <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                    {isSignup
                      ? "Choose your account type to get started."
                      : "Choose your account type and sign in."}
                  </p>
                </div>

                {/* ROLE SELECTION */}
                <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">

                  {/* PUBLIC USER */}
                  <button
                    type="button"
                    onClick={() => setRole("user")}
                    className={`rounded-xl border p-4 text-left transition ${
                      role === "user"
                        ? "border-sky-500 bg-sky-50 ring-2 ring-sky-100 dark:border-sky-500 dark:bg-sky-950/40 dark:ring-sky-900"
                        : "border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600"
                    }`}
                  >
                    <div className="text-2xl">👤</div>

                    <p className="mt-2 font-semibold text-slate-900 dark:text-white">
                      Public User
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                      Explore science and educational resources.
                    </p>
                  </button>

                  {/* RESEARCHER */}
                  <button
                    type="button"
                    onClick={() => setRole("researcher")}
                    className={`rounded-xl border p-4 text-left transition ${
                      role === "researcher"
                        ? "border-sky-500 bg-sky-50 ring-2 ring-sky-100 dark:border-sky-500 dark:bg-sky-950/40 dark:ring-sky-900"
                        : "border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600"
                    }`}
                  >
                    <div className="text-2xl">🔬</div>

                    <p className="mt-2 font-semibold text-slate-900 dark:text-white">
                      Researcher
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                      Submit documents and access research features.
                    </p>
                  </button>

                  {/* ADMIN */}
                  <button
                    type="button"
                    onClick={() => setRole("admin")}
                    className={`rounded-xl border p-4 text-left transition ${
                      role === "admin"
                        ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-100 dark:border-indigo-500 dark:bg-indigo-950/40 dark:ring-indigo-900"
                        : "border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600"
                    }`}
                  >
                    <div className="text-2xl">🛡️</div>

                    <p className="mt-2 font-semibold text-slate-900 dark:text-white">
                      Admin
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                      Review and manage researcher submissions.
                    </p>
                  </button>

                </div>

                {/* ROLE INFORMATION */}
                <div className="mt-5 rounded-xl bg-slate-50 p-4 dark:bg-slate-800">

                  {role === "user" && (
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        Public User Account
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                        Browse datasets, visualization, outreach, education,
                        news and other public resources.
                      </p>
                    </div>
                  )}

                  {role === "researcher" && (
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        Researcher Account
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                        Access research datasets, collaboration and document
                        submission features.
                      </p>
                    </div>
                  )}

                  {role === "admin" && (
                    <div>
                      <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-400">
                        Administrator Account
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                        Review researcher documents, verify submissions and
                        manage approved files.
                      </p>
                    </div>
                  )}

                </div>

                {/* FORM */}
                <form
                  onSubmit={handleSubmit}
                  className="mt-8 space-y-5"
                >

                  {/* NAME */}
                  {isSignup && role !== "admin" && (
                    <div>
                      <label
                        htmlFor="name"
                        className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                      >
                        Full Name
                      </label>

                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Enter your full name"
                        required
                        className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-sky-900"
                      />
                    </div>
                  )}

                  {/* INSTITUTION */}
                  {isSignup && role === "researcher" && (
                    <div>
                      <label
                        htmlFor="institution"
                        className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                      >
                        Institution / Organization
                      </label>

                      <input
                        id="institution"
                        type="text"
                        value={institution}
                        onChange={(event) =>
                          setInstitution(event.target.value)
                        }
                        placeholder="Enter your institution"
                        required
                        className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-sky-900"
                      />
                    </div>
                  )}

                  {/* EMAIL */}
                  <div>
                    <label
                      htmlFor="email"
                      className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Email Address
                    </label>

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                      required
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-sky-900"
                    />
                  </div>

                  {/* PASSWORD */}
                  <div>
                    <label
                      htmlFor="password"
                      className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Password
                    </label>

                    <div className="relative mt-2">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(event) =>
                          setPassword(event.target.value)
                        }
                        placeholder="Enter your password"
                        required
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-20 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-sky-900"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  {/* REMEMBER ME */}
                  {!isSignup && (
                    <div className="flex items-center justify-between text-sm">

                      <label className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 dark:border-slate-600 dark:bg-slate-800"
                        />
                        Remember me
                      </label>

                      <button
                        type="button"
                        className="font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
                        onClick={() =>
                          alert("Password reset will be connected later.")
                        }
                      >
                        Forgot password?
                      </button>

                    </div>
                  )}

                  {/* SUBMIT BUTTON */}
                  <button
                    type="submit"
                    className={`w-full rounded-xl px-5 py-3 font-semibold text-white transition ${
                      role === "admin"
                        ? "bg-indigo-600 hover:bg-indigo-700"
                        : "bg-sky-600 hover:bg-sky-700"
                    }`}
                  >
                    {isSignup
                      ? `Create ${
                          role === "user"
                            ? "User"
                            : role === "researcher"
                            ? "Researcher"
                            : "Admin"
                        } Account`
                      : `Login as ${
                          role === "user"
                            ? "Public User"
                            : role === "researcher"
                            ? "Researcher"
                            : "Admin"
                        }`}
                  </button>

                </form>

                {/* SIGNUP SWITCH */}
                <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
                  {isSignup
                    ? "Already have an account?"
                    : "Don't have an account?"}{" "}

                  <button
                    type="button"
                    onClick={() => setIsSignup(!isSignup)}
                    className="font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
                  >
                    {isSignup ? "Login" : "Sign up"}
                  </button>
                </div>

                {/* BACK */}
                <div className="mt-6 text-center">
                  <Link
                    href="/"
                    className="text-sm font-medium text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400"
                  >
                    ← Back to Polar Science Portal
                  </Link>
                </div>

                {/* ADMIN MESSAGE */}
                {role === "admin" && (
                  <div className="mt-8 rounded-xl border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-900 dark:bg-indigo-950/40">
                    <p className="text-xs leading-5 text-indigo-800 dark:text-indigo-300">
                      <span className="font-semibold">
                        Administrator access:
                      </span>{" "}
                      Admin login will open the Administration Dashboard.
                    </p>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}