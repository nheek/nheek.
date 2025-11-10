"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Contribution {
  id: number;
  name: string;
  category: string;
  content: string;
  website_url: string | null;
  song_link: string | null;
  show_link: number;
  created_at: string;
}

// Display Components
function GraffitiDisplay({ content }: { content: string }) {
  return (
    <div className="flex justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={content}
        alt="Graffiti"
        className="max-w-full rounded-lg border-2 border-white/20"
      />
    </div>
  );
}

function EmojiDisplay({ content }: { content: string }) {
  return (
    <div className="flex justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={content}
        alt="Emoji Art"
        className="max-w-full rounded-lg border-2 border-white/20"
      />
    </div>
  );
}

function GuestbookDisplay({
  content,
  name,
}: {
  content: string;
  name: string;
}) {
  return (
    <div className="relative bg-gradient-to-br from-amber-100 to-orange-100 p-6 rounded-lg border-4 border-amber-900 shadow-2xl">
      <div className="absolute top-2 left-2 text-4xl opacity-20">📖</div>
      <div className="relative z-10">
        <p className="text-gray-800 italic font-serif leading-relaxed mb-4">
          &ldquo;{content}&rdquo;
        </p>
        <p className="text-right text-sm text-gray-700 font-bold">— {name}</p>
      </div>
      <div className="absolute bottom-0 right-0 w-0 h-0 border-t-[20px] border-t-transparent border-r-[20px] border-r-amber-900 border-b-[20px] border-b-transparent opacity-50" />
    </div>
  );
}

function SongDisplay({
  content,
  name,
  songLink,
}: {
  content: string;
  name: string;
  songLink?: string | null;
}) {
  return (
    <div className="relative">
      <div className="relative w-full aspect-square max-w-[280px] mx-auto">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-900 via-gray-800 to-black shadow-2xl">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute inset-0 rounded-full border border-gray-700/30"
              style={{ transform: `scale(${0.9 - i * 0.1})` }}
            />
          ))}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[45%] aspect-square rounded-full bg-gradient-to-br from-purple-900 via-purple-700 to-purple-900 border-4 border-purple-600 shadow-xl flex items-center justify-center p-4">
            <div className="text-center">
              <div className="text-2xl mb-1">💿</div>
              <p className="text-xs text-white font-bold leading-tight break-words">
                {content}
              </p>
            </div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[12%] aspect-square rounded-full bg-gray-950 shadow-inner" />
        </div>
      </div>
      <p className="text-center text-sm text-gray-300 mt-4 font-semibold">
        recommended by {name}
      </p>
      {songLink && (
        <div className="text-center mt-2">
          <a
            href={songLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-purple-400 hover:text-purple-300 hover:underline inline-flex items-center gap-1"
          >
            🎵 listen here
          </a>
        </div>
      )}
    </div>
  );
}

function FortuneDisplay({ content, name }: { content: string; name: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full group cursor-pointer transition-transform hover:scale-110"
        >
          <div className="relative mx-auto w-32 h-24">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-200 via-yellow-100 to-amber-300 rounded-full shadow-lg transform rotate-12"></div>
            <div className="absolute inset-1 bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-200 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl">
              🥠
            </div>
          </div>
          <p className="text-center text-xs text-gray-400 mt-2">
            click to open
          </p>
        </button>
      ) : (
        <div className="bg-gradient-to-br from-yellow-50 to-amber-100 p-6 rounded-lg border-2 border-amber-300 shadow-xl">
          <div className="text-center mb-4 text-2xl">🥠</div>
          <p className="text-gray-800 italic text-center leading-relaxed mb-4">
            &ldquo;{content}&rdquo;
          </p>
          <p className="text-center text-xs text-gray-600">from {name}</p>
        </div>
      )}
    </div>
  );
}

const CATEGORY_LABELS: Record<string, { icon: string; name: string }> = {
  graffiti: { icon: "🎨", name: "Graffiti" },
  guestbook: { icon: "📖", name: "Guestbook" },
  song: { icon: "💿", name: "Song" },
  emoji: { icon: "😊", name: "Emoji" },
  fortune: { icon: "🥠", name: "Fortune" },
};

const CATEGORY_STYLES: Record<string, string> = {
  graffiti:
    "bg-gradient-to-br from-pink-900/30 to-rose-900/30 border-pink-500/20 hover:border-pink-400/40",
  guestbook:
    "bg-gradient-to-br from-amber-900/30 to-orange-900/30 border-amber-500/20 hover:border-amber-400/40",
  song: "bg-gradient-to-br from-purple-900/30 to-violet-900/30 border-purple-500/20 hover:border-purple-400/40",
  emoji:
    "bg-gradient-to-br from-yellow-900/30 to-amber-900/30 border-yellow-500/20 hover:border-yellow-400/40",
  fortune:
    "bg-gradient-to-br from-orange-900/30 to-red-900/30 border-orange-500/20 hover:border-orange-400/40",
};

export default function WallClient({
  initialContributions,
}: {
  initialContributions: Contribution[];
}) {
  const [filter, setFilter] = useState<string>("all");
  const [selectedContribution, setSelectedContribution] =
    useState<Contribution | null>(null);

  const filteredContributions =
    filter === "all"
      ? initialContributions
      : initialContributions.filter((c) => c.category === filter);

  const categoryCounts = initialContributions.reduce(
    (acc, c) => {
      acc[c.category] = (acc[c.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <>
      {/* Header */}
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
          all ({initialContributions.length})
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

      {/* Empty State */}
      {filteredContributions.length === 0 && (
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
      {filteredContributions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredContributions.map((contribution, index) => (
            <motion.div
              key={contribution.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              onClick={() => setSelectedContribution(contribution)}
              className={`group rounded-lg border-2 p-6 backdrop-blur cursor-pointer ${
                CATEGORY_STYLES[contribution.category]
              }`}
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-3xl">
                  {CATEGORY_LABELS[contribution.category].icon}
                </span>
                <span className="rounded-full bg-white/10 backdrop-blur px-4 py-1 text-xs font-semibold text-gray-300 border border-white/20">
                  {CATEGORY_LABELS[contribution.category].name}
                </span>
              </div>

              <div className="min-h-[140px]">
                {contribution.category === "graffiti" ? (
                  <GraffitiDisplay content={contribution.content} />
                ) : contribution.category === "emoji" ? (
                  <EmojiDisplay content={contribution.content} />
                ) : contribution.category === "guestbook" ? (
                  <GuestbookDisplay
                    content={contribution.content}
                    name={contribution.name}
                  />
                ) : contribution.category === "song" ? (
                  <SongDisplay
                    content={contribution.content}
                    name={contribution.name}
                    songLink={contribution.song_link}
                  />
                ) : contribution.category === "fortune" ? (
                  <FortuneDisplay
                    content={contribution.content}
                    name={contribution.name}
                  />
                ) : (
                  <>
                    <h3 className="mb-3 text-xl font-bold text-white">
                      {contribution.name}
                    </h3>
                    <p className="text-gray-300 italic leading-relaxed">
                      &ldquo;{contribution.content}&rdquo;
                    </p>
                  </>
                )}
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-white/20 pt-4">
                <span className="text-xs text-gray-400">
                  {new Date(contribution.created_at).toLocaleDateString(
                    "en-US",
                    { month: "short", day: "numeric", year: "numeric" },
                  )}
                </span>
                {contribution.website_url && contribution.show_link === 1 && (
                  <a
                    href={contribution.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs text-emerald-400 transition hover:text-emerald-300 hover:underline flex items-center gap-1"
                  >
                    🔗 visit
                  </a>
                )}
              </div>
            </motion.div>
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

      {/* Modal */}
      <AnimatePresence>
        {selectedContribution && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setSelectedContribution(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, type: "spring" }}
              className="relative max-w-5xl max-h-[90vh] w-full overflow-auto rounded-xl bg-[#0d1f1a] border-2 border-emerald-700 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedContribution(null)}
                className="absolute top-4 right-4 z-10 rounded-full bg-red-600 hover:bg-red-500 text-white w-10 h-10 flex items-center justify-center text-xl font-bold transition"
              >
                ×
              </button>

              <div className="p-8">
                <div className="mb-6 flex items-center gap-3">
                  <span className="text-5xl">
                    {CATEGORY_LABELS[selectedContribution.category].icon}
                  </span>
                  <div>
                    <span className="rounded-full bg-emerald-700 px-4 py-1 text-sm font-semibold text-white">
                      {CATEGORY_LABELS[selectedContribution.category].name}
                    </span>
                    <h2 className="mt-2 text-2xl font-bold text-white">
                      {selectedContribution.name}
                    </h2>
                  </div>
                </div>

                <div className="mb-6">
                  {selectedContribution.category === "graffiti" ||
                  selectedContribution.category === "emoji" ? (
                    <div className="flex justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedContribution.content}
                        alt={`${selectedContribution.category} by ${selectedContribution.name}`}
                        className="max-w-full rounded-lg border-2 border-emerald-700"
                      />
                    </div>
                  ) : selectedContribution.category === "guestbook" ? (
                    <GuestbookDisplay
                      content={selectedContribution.content}
                      name={selectedContribution.name}
                    />
                  ) : selectedContribution.category === "song" ? (
                    <SongDisplay
                      content={selectedContribution.content}
                      name={selectedContribution.name}
                      songLink={selectedContribution.song_link}
                    />
                  ) : selectedContribution.category === "fortune" ? (
                    <FortuneDisplay
                      content={selectedContribution.content}
                      name={selectedContribution.name}
                    />
                  ) : (
                    <p className="text-xl text-gray-300 italic leading-relaxed">
                      &ldquo;{selectedContribution.content}&rdquo;
                    </p>
                  )}
                </div>

                <div className="border-t border-emerald-900/50 pt-4 space-y-2">
                  <p className="text-sm text-gray-400">
                    Submitted on{" "}
                    {new Date(
                      selectedContribution.created_at,
                    ).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  {selectedContribution.website_url &&
                    selectedContribution.show_link === 1 && (
                      <a
                        href={selectedContribution.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-sm text-emerald-400 hover:text-emerald-300 hover:underline"
                      >
                        🔗 Visit {selectedContribution.name}&apos;s website
                      </a>
                    )}
                  {selectedContribution.song_link && (
                    <a
                      href={selectedContribution.song_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-purple-400 hover:text-purple-300 hover:underline"
                    >
                      🎵 Listen to this song
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
