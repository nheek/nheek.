"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navigate from "@/components/Navigate";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

interface Contribution {
  id: number;
  name: string;
  category: string;
  content: string;
  website_url: string | null;
  created_at: string;
}

const CATEGORY_LABELS: Record<string, { icon: string; name: string }> = {
  graffiti: { icon: "🎨", name: "Graffiti" },
  guestbook: { icon: "📝", name: "Guestbook" },
  song: { icon: "🎵", name: "Song" },
  star: { icon: "⭐", name: "Star" },
  fortune: { icon: "🔮", name: "Fortune" },
};

const CATEGORY_STYLES: Record<string, string> = {
  graffiti:
    "bg-gradient-to-br from-pink-900/30 to-rose-900/30 border-pink-500/20 hover:border-pink-400/40",
  guestbook:
    "bg-gradient-to-br from-cyan-900/30 to-teal-900/30 border-cyan-500/20 hover:border-cyan-400/40",
  song: "bg-gradient-to-br from-purple-900/30 to-violet-900/30 border-purple-500/20 hover:border-purple-400/40",
  star: "bg-gradient-to-br from-yellow-900/30 to-amber-900/30 border-yellow-500/20 hover:border-yellow-400/40",
  fortune:
    "bg-gradient-to-br from-emerald-900/30 to-green-900/30 border-emerald-500/20 hover:border-emerald-400/40",
};

export default function WallPage() {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetchContributions();
  }, []);

  const fetchContributions = async () => {
    try {
      const res = await fetch("/api/contributions?status=approved");
      const data = await res.json();
      setContributions(data.contributions || []);
    } catch (error) {
      console.error("Failed to fetch contributions:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredContributions =
    filter === "all"
      ? contributions
      : contributions.filter((c) => c.category === filter);

  const categoryCounts = contributions.reduce(
    (acc, c) => {
      acc[c.category] = (acc[c.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="min-h-screen bg-[#0a1410] text-white">
      <Header compact={true} customHeaderText="nheek" />
      
      <main>
        {/* Header */}
        <div className="w-[85%] mx-auto pt-8">
          <div className="text-center mb-12">
            <h1 className="text-6xl md:text-8xl font-bold mb-4">the wall ✨</h1>
            <p className="text-lg md:text-xl text-gray-400 mb-8">
              visitors from around the world left their mark
            </p>
            <Link
              href="/contribute"
              className="inline-block bg-emerald-700 hover:bg-emerald-600 text-white font-semibold rounded-full px-8 py-3 transition-all duration-300 hover:scale-105"
            >
              + leave your mark
            </Link>
          </div>

          {/* Filter Tabs */}
          <div className="mb-12 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-full px-6 py-2 font-semibold transition-all duration-300 ${
                filter === "all"
                  ? "bg-emerald-700 text-white scale-105"
                  : "bg-[#0d1f1a] text-white hover:bg-gray-200 hover:text-[#0d1f1a]"
              }`}
            >
              all ({contributions.length})
            </button>
            {Object.entries(CATEGORY_LABELS).map(([key, { icon, name }]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`rounded-full px-6 py-2 font-semibold transition-all duration-300 ${
                  filter === key
                    ? "bg-emerald-700 text-white scale-105"
                    : "bg-[#0d1f1a] text-white hover:bg-gray-200 hover:text-[#0d1f1a]"
                }`}
              >
                {icon} {name} ({categoryCounts[key] || 0})
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="py-24 text-center text-gray-400 text-xl">
              loading contributions...
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredContributions.length === 0 && (
            <div className="rounded-lg bg-[#0d1f1a]/50 backdrop-blur p-16 text-center border border-emerald-900/30">
              <p className="text-xl text-gray-400 mb-6">
                no contributions yet in this category.
              </p>
              <Link
                href="/contribute"
                className="inline-block text-emerald-400 hover:text-emerald-300 font-semibold hover:underline"
              >
                be the first! →
              </Link>
            </div>
          )}

          {/* Contributions Grid */}
          {!loading && filteredContributions.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {filteredContributions.map((contribution) => (
                <div
                  key={contribution.id}
                  className={`group rounded-lg border-2 p-6 backdrop-blur transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                    CATEGORY_STYLES[contribution.category]
                  }`}
                >
                  {/* Category Badge */}
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-3xl">
                      {CATEGORY_LABELS[contribution.category].icon}
                    </span>
                    <span className="rounded-full bg-white/10 backdrop-blur px-4 py-1 text-xs font-semibold text-gray-300 border border-white/20">
                      {CATEGORY_LABELS[contribution.category].name}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="min-h-[140px]">
                    <h3 className="mb-3 text-xl font-bold text-white">
                      {contribution.name}
                    </h3>
                    <p className="text-gray-300 italic leading-relaxed">
                      &ldquo;{contribution.content}&rdquo;
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="mt-6 flex items-center justify-between border-t border-white/20 pt-4">
                    <span className="text-xs text-gray-400">
                      {new Date(contribution.created_at).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric", year: "numeric" },
                      )}
                    </span>
                    {contribution.website_url && (
                      <a
                        href={contribution.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-emerald-400 transition hover:text-emerald-300 hover:underline flex items-center gap-1"
                      >
                        🔗 visit
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Info Box */}
          <div className="mb-16 rounded-lg bg-[#0d1f1a]/30 backdrop-blur border border-emerald-900/30 p-6 text-center">
            <p className="text-sm text-gray-400">
              💡 all contributions are reviewed before appearing. one entry per
              category per visitor.
            </p>
          </div>
        </div>

        <Navigate underPage={true} />
      </main>
      <Footer />
    </div>
  );
}
