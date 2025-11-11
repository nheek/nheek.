"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

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

export default function PollsClient({ polls: initialPolls }: { polls: Poll[] }) {
  const [polls, setPolls] = useState<Poll[]>(initialPolls);
  const [votedPolls, setVotedPolls] = useState<Record<number, number[]>>({});
  const [fingerprint, setFingerprint] = useState<string>("");
  const themeColor = "#7e22ce"; // purple-700

  // Generate a simple fingerprint
  useEffect(() => {
    const fp = `${navigator.userAgent}-${screen.width}x${screen.height}-${new Date().getTimezoneOffset()}`;
    setFingerprint(fp);

    // Check which polls the user has voted on
    polls.forEach((poll) => {
      fetch(`/api/polls/${poll.id}/vote?fingerprint=${encodeURIComponent(fp)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.hasVoted) {
            setVotedPolls((prev) => ({
              ...prev,
              [poll.id]: data.votedOptions,
            }));
          }
        });
    });
  }, [polls]);

  const handleVote = async (pollId: number, optionId: number) => {
    try {
      const res = await fetch(`/api/polls/${pollId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId, fingerprint }),
      });

      if (res.ok) {
        // Update local state
        setVotedPolls((prev) => ({
          ...prev,
          [pollId]: [...(prev[pollId] || []), optionId],
        }));

        // Refresh poll data
        const updatedPoll = await fetch(`/api/polls/${pollId}`).then((r) =>
          r.json()
        );
        setPolls((prev) =>
          prev.map((p) => (p.id === pollId ? updatedPoll : p))
        );
      } else {
        const error = await res.json();
        alert(error.error || "Failed to vote");
      }
    } catch (error) {
      console.error("Error voting:", error);
      alert("Failed to vote");
    }
  };

  if (polls.length === 0) {
    return (
      <div className="w-[85%] mx-auto py-16 min-h-screen">
        <h2 className="text-2xl md:text-[3rem] xl:text-[4rem] text-center" style={{ color: themeColor }}>
          polls
        </h2>
        <p className="text-gray-400 text-lg mx-auto">no active polls at the moment</p>
      </div>
    );
  }

  return (
    <div className="w-[85%] mx-auto pt-16">
      <h2 className="text-2xl md:text-[3rem] xl:text-[4rem] text-center" style={{ color: themeColor }}>
          polls
        </h2>
      <p className="text-gray-400 mb-12 text-lg mx-auto text-center">
        vote on active polls and see the community&apos;s choices
      </p>

      <div className="space-y-8">
        <AnimatePresence>
          {polls.map((poll) => {
            const hasVoted = votedPolls[poll.id]?.length > 0;
            const allowMultiple = poll.allow_multiple_votes === 1;

            return (
              <motion.div
                key={poll.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30"
              >
                <h2 className="text-2xl font-bold mb-2" style={{ color: themeColor }}>
                  {poll.title}
                </h2>
                {poll.description && (
                  <p className="text-gray-400 mb-6">{poll.description}</p>
                )}

              <div className="space-y-4">
                {poll.options.map((option) => {
                  const percentage =
                    poll.totalVotes > 0
                      ? ((option.vote_count / poll.totalVotes) * 100).toFixed(1)
                      : "0.0";
                  const hasVotedForOption = votedPolls[poll.id]?.includes(
                    option.id
                  );

                  return (
                    <motion.div
                      key={option.id}
                      className={`relative overflow-hidden rounded-xl border-2 transition-all ${
                        hasVotedForOption
                          ? "border-purple-500 bg-purple-900/20"
                          : hasVoted
                            ? "border-gray-700 bg-gray-800/50"
                            : "border-gray-600 hover:border-purple-400 cursor-pointer bg-gray-800/50"
                      }`}
                      onClick={() => {
                        if (!hasVoted || (allowMultiple && !hasVotedForOption)) {
                          handleVote(poll.id, option.id);
                        }
                      }}
                      whileHover={!hasVoted || (allowMultiple && !hasVotedForOption) ? { scale: 1.02 } : {}}
                      whileTap={!hasVoted || (allowMultiple && !hasVotedForOption) ? { scale: 0.98 } : {}}
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
                            <h3 className="font-semibold text-lg">
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
                              {option.vote_count} vote{option.vote_count !== 1 ? "s" : ""}
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                <span>
                  {hasVoted
                    ? allowMultiple
                      ? "You can vote for multiple options"
                      : "Thank you for voting!"
                    : "Click an option to vote"}
                </span>
                <span>{poll.totalVotes} total votes</span>
              </div>

              {poll.end_date && (
                <p className="text-xs text-gray-500 mt-2">
                  Ends: {new Date(poll.end_date).toLocaleDateString()}
                </p>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
      </div>
    </div>
  );
}
