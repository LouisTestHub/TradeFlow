'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[TradeFlow Error]', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#FAFAF5] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Something went wrong</h1>
        <p className="text-slate-500 mb-6 text-sm">
          We hit an unexpected issue. This has been logged and we&apos;ll look into it.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-5 py-2.5 bg-[#1B5E20] text-white rounded-lg font-medium text-sm hover:bg-[#2E7D32] transition-colors"
          >
            Try Again
          </button>
          <a
            href="/dashboard"
            className="px-5 py-2.5 bg-white border border-gray-200 text-slate-700 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors"
          >
            Back to Dashboard
          </a>
        </div>
        {error.digest && (
          <p className="text-xs text-slate-400 mt-6">Error reference: {error.digest}</p>
        )}
      </div>
    </div>
  );
}
