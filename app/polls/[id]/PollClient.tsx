"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface PollOption {
  id: number;
  poll_id: number;
  name: string;
  description: string | null;
  image_url: string | null;
  link: string | null;
  vote_count: number;
  display_order: number;
}

interface Poll {
  id: number;
  title: string;
  description: string | null;
  status: string;
  allow_multiple_votes: number;
  end_date: string | null;
  created_at: string;
  options: PollOption[];
  totalVotes: number;
}

export default function PollClient({ poll: initialPoll }: { poll: Poll }) {
  const [poll, setPoll] = useState<Poll>(initialPoll);
  const [votedOptions, setVotedOptions] = useState<number[]>([]);
  const [fingerprint, setFingerprint] = useState<string>("");
  const themeColor = "#7e22ce"; // purple-700

  // Generate a simple fingerprint
  useEffect(() => {
    const fp = `${navigator.userAgent}-${screen.width}x${screen.height}-${new Date().getTimezoneOffset()}`;
    setFingerprint(fp);

    // Check if user has voted
    fetch(`/api/polls/${poll.id}/vote?fingerprint=${encodeURIComponent(fp)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.hasVoted) {
          setVotedOptions(data.votedOptions);
        }
      });
  }, [poll.id]);

  const handleVote = async (optionId: number) => {
    try {
      const res = await fetch(`/api/polls/${poll.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId, fingerprint }),
      });

      if (res.ok) {
        // Update local state
        setVotedOptions((prev) => [...prev, optionId]);

        // Refresh poll data
        const updatedPoll = await fetch(`/api/polls/${poll.id}`).then((r) =>
          r.json(),
        );
        setPoll(updatedPoll);
      } else {
        const error = await res.json();
        alert(error.error || "Failed to vote");
      }
    } catch (error) {
      console.error("Error voting:", error);
      alert("Failed to vote");
    }
  };

  const hasVoted = votedOptions.length > 0;
  const allowMultiple = poll.allow_multiple_votes === 1;

  const isPollEnded = poll.status === "ended";

  return (
    <main className="w-full md:w-[70%] lg:w-[60%] xl:w-[50%] mx-auto mt-12 md:mt-20 mb-20">
      <div className="mb-8">
        <Link
          href="/polls"
          className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-2 mb-4"
        >
          ← Back to all polls
        </Link>

        {isPollEnded && (
          <div className="bg-red-900/30 border border-red-700/50 rounded-lg px-4 py-3 mb-4">
            <p className="text-red-300 font-semibold">
              ⚠️ This poll has ended. Voting is no longer available.
            </p>
          </div>
        )}

        <h1
          className="text-3xl md:text-5xl font-bold mb-4"
          style={{ color: themeColor }}
        >
          {poll.title}
        </h1>
        {poll.description && (
          <p className="text-gray-400 text-lg mb-6">{poll.description}</p>
        )}
        <div className="text-sm text-gray-500">
          {poll.totalVotes} total vote{poll.totalVotes !== 1 ? "s" : ""} •{" "}
          {allowMultiple ? "Multiple votes allowed" : "Single vote only"}
          {poll.end_date &&
            ` • Ends ${new Date(poll.end_date).toLocaleDateString()}`}
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {poll.options.map((option) => {
          const percentage =
            poll.totalVotes > 0
              ? ((option.vote_count / poll.totalVotes) * 100).toFixed(1)
              : "0.0";
          const hasVotedForOption = votedOptions.includes(option.id);

          return (
            <motion.div
              key={option.id}
              className={`relative overflow-hidden rounded-xl border-2 transition-all ${
                hasVotedForOption
                  ? "border-purple-500 bg-purple-900/20"
                  : hasVoted || isPollEnded
                    ? "border-gray-700 bg-gray-800/50"
                    : "border-gray-600 hover:border-purple-400 cursor-pointer bg-gray-800/50"
              }`}
              onClick={() => {
                if (
                  !isPollEnded &&
                  (!hasVoted || (allowMultiple && !hasVotedForOption))
                ) {
                  handleVote(option.id);
                }
              }}
              whileHover={
                !isPollEnded &&
                (!hasVoted || (allowMultiple && !hasVotedForOption))
                  ? { scale: 1.02 }
                  : {}
              }
              whileTap={
                !hasVoted || (allowMultiple && !hasVotedForOption)
                  ? { scale: 0.98 }
                  : {}
              }
            >
              {/* Progress bar background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20"
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />

              <div className="relative z-10 p-4 flex items-center gap-4">
                {option.image_url && (
                  <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                    <Image
                      src={option.image_url}
                      alt={option.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-lg text-white">
                      {option.name}
                    </h3>
                    {hasVoted && (
                      <span className="text-sm font-medium text-purple-400">
                        {percentage}%
                      </span>
                    )}
                  </div>
                  {option.description && (
                    <p className="text-sm text-gray-400">
                      {option.description}
                    </p>
                  )}
                  {option.link && (
                    <a
                      href={option.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-purple-400 hover:text-purple-300 inline-flex items-center gap-1 mt-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Learn more →
                    </a>
                  )}
                </div>

                {hasVoted && (
                  <div className="text-right">
                    <span className="text-sm text-gray-400">
                      {option.vote_count} vote
                      {option.vote_count !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="text-center text-gray-500 text-sm">
        {hasVoted
          ? allowMultiple
            ? "You can vote for multiple options"
            : "Thank you for voting!"
          : "Click an option to vote"}
      </div>

      {/* Share Section */}
      <div className="mt-12 p-6 rounded-xl bg-gray-800/30 border border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-3">
          Share this poll
        </h3>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={typeof window !== "undefined" ? window.location.href : ""}
            readOnly
            className="flex-1 bg-gray-900/50 text-gray-300 px-4 py-2 rounded-lg border border-gray-700 text-sm"
          />
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("Link copied to clipboard!");
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Copy Link
          </button>
        </div>
      </div>
    </main>
  );
}
