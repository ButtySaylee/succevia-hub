"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app/error]", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-red-50 rounded-3xl mb-6">
          <AlertTriangle className="w-12 h-12 text-red-400" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#002147] mb-3">
          Something Went Wrong
        </h1>
        <p className="text-slate-500 text-sm sm:text-base mb-8 leading-relaxed">
          An unexpected error occurred. Our team has been notified. 
          Please try again or go back to the homepage.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1da851] text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-white text-[#002147] border-2 border-[#002147] font-semibold px-6 py-3 rounded-xl text-sm transition-all hover:bg-slate-50 active:scale-95"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </div>
        {process.env.NODE_ENV === "development" && (
          <details className="mt-8 text-left bg-slate-100 rounded-xl p-4">
            <summary className="text-sm font-semibold text-slate-600 cursor-pointer">
              Error Details (Dev Only)
            </summary>
            <pre className="mt-2 text-xs text-red-600 overflow-auto max-h-40 whitespace-pre-wrap">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
      </div>
    </main>
  );
}