"use client";

import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import Link from "next/link";
import { useEffect, useState } from "react";

import ThemeToggle from "./ThemeToggle";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Datasets", href: "/datasets" },
  { name: "Visualization", href: "/visualization" },
  { name: "Outreach", href: "/outreach" },
  { name: "Education", href: "/education" },
  { name: "Careers", href: "/careers" },
  { name: "Collaboration", href: "/collaboration" },
  { name: "News", href: "/news" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedLogin = localStorage.getItem("polarLoggedIn");
    const storedRole = localStorage.getItem("polarRole");

    if (storedLogin === "true") {
      setLoggedIn(true);
      setRole(storedRole || "user");
    } else {
      setLoggedIn(false);
      setRole("");
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("polarLoggedIn");
    localStorage.removeItem("polarRole");

    setLoggedIn(false);
    setRole("");
    setMenuOpen(false);

    window.location.href = "/";
  };

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // Workspace is ONLY available for researchers
  const isResearcher = loggedIn && role === "researcher";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-600 text-xl text-white">
            ❄
          </div>

          <div>
            <div className="text-lg font-bold tracking-wide text-slate-900 dark:text-white">
              POLAR SCIENCE
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400">
              India&apos;s Polar Research Portal
            </div>
          </div>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-5 lg:flex">
          {navItems.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative py-2 text-sm transition ${
                  active
                    ? "font-bold text-slate-950 dark:text-white"
                    : "font-medium text-slate-600 hover:text-sky-600 dark:text-slate-300 dark:hover:text-sky-400"
                }`}
              >
                {item.name}

                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-sky-600 dark:bg-sky-400" />
                )}
              </Link>
            );
          })}

          {/* Researcher Workspace */}
          {isResearcher && (
            <Link
              href="/workspace"
              className={`relative flex items-center gap-1.5 py-2 text-sm transition ${
                isActive("/workspace")
                  ? "font-bold text-slate-950 dark:text-white"
                  : "font-semibold text-sky-700 hover:text-sky-600 dark:text-sky-300 dark:hover:text-sky-400"
              }`}
            >
              <span>🔬</span>
              <span>Workspace</span>

              {isActive("/workspace") && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-sky-600 dark:bg-sky-400" />
              )}
            </Link>
          )}

          {/* Theme Toggle */}
          <ThemeToggle />

          {loggedIn ? (
            <div className="flex items-center gap-3">

              {/* User / Researcher */}
              <Link
                href="/login"
                className="rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-300"
              >
                {role === "researcher" ? "🔬 Researcher" : "👤 User"}
              </Link>

              {/* Logout + Back */}
              <div className="flex flex-col items-center gap-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                >
                  Logout
                </button>

                {/* Back - hidden on Home */}
                {pathname !== "/" && (
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex items-center gap-1 text-xs font-medium text-slate-500 transition hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400"
                  >
                    <ArrowLeft size={14} />
                    <span>Back</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <Link
                href="/login"
                className="rounded-full bg-sky-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
              >
                Login / Signup
              </Link>

              {/* Back - hidden on Home */}
              {pathname !== "/" && (
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex items-center gap-1 text-xs font-medium text-slate-500 transition hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400"
                >
                  <ArrowLeft size={14} />
                  <span>Back</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-xl text-slate-700 dark:border-slate-700 dark:text-slate-200"
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>
      </nav>

      {/* Mobile navigation */}
      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-950 lg:hidden">
          <div className="flex flex-col gap-2">

            {navItems.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-lg px-3 py-2 text-sm transition ${
                    active
                      ? "bg-sky-50 font-bold text-slate-950 dark:bg-slate-900 dark:text-white"
                      : "font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-600 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-sky-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{item.name}</span>

                    {active && (
                      <span className="h-2 w-2 rounded-full bg-sky-600 dark:bg-sky-400" />
                    )}
                  </div>
                </Link>
              );
            })}

            {/* Researcher Workspace - Mobile */}
            {isResearcher && (
              <Link
                href="/workspace"
                onClick={() => setMenuOpen(false)}
                className={`rounded-lg px-3 py-2 text-sm transition ${
                  isActive("/workspace")
                    ? "bg-sky-50 font-bold text-slate-950 dark:bg-slate-900 dark:text-white"
                    : "font-semibold text-sky-700 hover:bg-sky-50 dark:text-sky-300 dark:hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>🔬 Workspace</span>

                  {isActive("/workspace") && (
                    <span className="h-2 w-2 rounded-full bg-sky-600 dark:bg-sky-400" />
                  )}
                </div>
              </Link>
            )}

            {loggedIn ? (
              <>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg bg-sky-50 px-4 py-3 text-center text-sm font-semibold text-sky-700 dark:bg-sky-950 dark:text-sky-300"
                >
                  {role === "researcher"
                    ? "🔬 Researcher Account"
                    : "👤 User Account"}
                </Link>

                {/* Mobile Logout + Back */}
                <div className="flex flex-col items-center gap-1">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white dark:bg-white dark:text-slate-900"
                  >
                    Logout
                  </button>

                  {pathname !== "/" && (
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        router.back();
                      }}
                      className="flex items-center gap-1 py-1 text-sm font-medium text-slate-500 transition hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400"
                    >
                      <ArrowLeft size={15} />
                      <span>Back</span>
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-1">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="w-full rounded-lg bg-sky-600 px-4 py-3 text-center text-sm font-semibold text-white"
                >
                  Login / Signup
                </Link>

                {pathname !== "/" && (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      router.back();
                    }}
                    className="flex items-center gap-1 py-1 text-sm font-medium text-slate-500 transition hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400"
                  >
                    <ArrowLeft size={15} />
                    <span>Back</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}