import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAFAF5] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-7xl mb-4">🌾</div>
        <h1 className="text-4xl font-bold text-slate-800 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-slate-600 mb-3">Page not found</h2>
        <p className="text-slate-500 mb-6 text-sm">
          This field doesn&apos;t seem to exist. Maybe it was harvested?
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/dashboard"
            className="px-5 py-2.5 bg-[#1B5E20] text-white rounded-lg font-medium text-sm hover:bg-[#2E7D32] transition-colors"
          >
            Back to Dashboard
          </Link>
          <Link
            href="/"
            className="px-5 py-2.5 bg-white border border-gray-200 text-slate-700 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
