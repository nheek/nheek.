import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#1a0b2e] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-purple-400 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-white mb-4">
          Poll Not Found
        </h2>
        <p className="text-gray-400 mb-8">
          This poll doesn&apos;t exist or has been removed.
        </p>
        <Link
          href="/polls"
          className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          View All Polls
        </Link>
      </div>
    </div>
  );
}
