"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm text-center">
        <h2 className="text-lg font-semibold mb-2">
          Something went wrong
        </h2>

        <p className="text-sm text-slate-600 mb-4">
          Please try again.
        </p>

        <button
          onClick={() => reset()}
          className="rounded-lg bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
