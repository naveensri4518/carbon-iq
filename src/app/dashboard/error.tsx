"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard Error Boundary Caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen pt-20 px-6 flex flex-col items-center justify-center max-w-2xl mx-auto text-center">
      <div className="w-24 h-24 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6 text-4xl border border-red-500/20">
        ⚠️
      </div>
      <h2 className="text-3xl font-bold mb-4 text-white">Something went wrong</h2>
      <p className="text-muted mb-8">
        We encountered an unexpected error while loading your dashboard. Please try refreshing the page.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl transition-colors font-semibold"
        >
          Try Again
        </button>
        <button
          onClick={() => window.location.href = "/"}
          className="bg-gradient-to-r from-[#8B5CF6] to-[#00D9F5] text-white px-6 py-3 rounded-xl transition-opacity hover:opacity-90 font-semibold"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
