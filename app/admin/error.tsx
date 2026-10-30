"use client";

import { useEffect } from "react";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-6 text-center">
      <h2 className="text-lg font-semibold text-white">Something went wrong</h2>
      <p className="max-w-md text-sm text-slate-400">
        We hit an unexpected error while loading this page.
      </p>
      <button
        type="button"
        onClick={() => retry()}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
