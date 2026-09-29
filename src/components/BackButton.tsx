"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
       className="fixed left-5 top-24 z-50 flex items-center gap-2 rounded-lg border border-slate-300 bg-white/90 px-3 py-2 text-sm font-medium text-slate-700 shadow-md backdrop-blur transition hover:bg-white dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-200 dark:hover:bg-slate-800"
    >
      <ArrowLeft size={17} />
      Back
    </button>
  );
}