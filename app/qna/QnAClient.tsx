"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type QnA = {
  id: number;
  question: string;
  answer: string | null;
  asker_name: string | null;
  created_at: string;
  answered_at: string | null;
};

type QnAClientProps = {
  initialQuestions: QnA[];
};

export default function QnAClient({ initialQuestions }: QnAClientProps) {
  const [questions] = useState<QnA[]>(initialQuestions);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showAskForm, setShowAskForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [askerName, setAskerName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newQuestion.trim()) {
      setSubmitMessage("Please enter a question");
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const res = await fetch("/api/qna", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: newQuestion.trim(),
          asker_name: askerName.trim() || null,
        }),
      });

      if (res.ok) {
        setSubmitMessage(
          "✅ Question submitted! I'll answer it soon and it will appear here.",
        );
        setNewQuestion("");
        setAskerName("");
      } else {
        const data = await res.json();
        setSubmitMessage(`❌ ${data.error || "Failed to submit question"}`);
      }
    } catch (error) {
      setSubmitMessage("❌ Error submitting question. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-2xl md:text-[3rem] xl:text-[4rem] text-center text-sky-400">
          ask me anything
        </h2>
        <p className="text-slate-300 text-lg mb-6">
          Got questions about my work, music, projects, or just about anything?
          Fire away!
        </p>

        {/* Toggle Ask Form Button */}
        <button
          onClick={() => setShowAskForm(!showAskForm)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-sky-700 hover:bg-sky-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
        >
          {showAskForm ? (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Close Form
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Ask a Question
            </>
          )}
        </button>
      </motion.div>

      {/* Submit Question Form */}
      {showAskForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-16"
        >
          <div className="bg-[#0a1628] rounded-2xl border border-sky-800/50 p-6 md:p-8 shadow-xl">
            <h2 className="text-2xl font-semibold text-sky-400 mb-4">
              Submit Your Question
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  value={askerName}
                  onChange={(e) => setAskerName(e.target.value)}
                  maxLength={50}
                  placeholder="Anonymous"
                  className="w-full px-4 py-3 bg-[#050d18] border border-sky-800/40 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-700 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Your Question
                </label>
                <textarea
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  maxLength={500}
                  rows={4}
                  placeholder="What would you like to know?"
                  required
                  className="w-full px-4 py-3 bg-[#050d18] border border-sky-800/40 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-700 focus:border-transparent transition resize-none"
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-slate-500">
                    {newQuestion.length}/500 characters
                  </span>
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 bg-sky-800 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
              >
                {isSubmitting ? "Submitting..." : "Submit Question"}
              </button>
            </form>
            {submitMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 p-4 rounded-lg text-sm ${
                  submitMessage.startsWith("✅")
                    ? "bg-green-900/40 border border-green-500/30 text-green-300"
                    : "bg-red-900/40 border border-red-500/30 text-red-300"
                }`}
              >
                {submitMessage}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      {/* Questions List */}
      <div className="space-y-6">
        <h2 className="text-3xl text-sky-300 mb-8">Answered Questions</h2>

        {questions.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🤔</div>
            <p className="text-slate-400 text-lg">
              No questions answered yet. Be the first to ask!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((qna, index) => (
              <motion.div
                key={qna.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div
                  className={`bg-[#0f1923] rounded-lg border transition-all duration-200 cursor-pointer overflow-hidden ${
                    expandedId === qna.id
                      ? "border-sky-700/60 shadow-lg"
                      : "border-sky-800/40 hover:border-sky-700/60"
                  }`}
                  onClick={() =>
                    setExpandedId(expandedId === qna.id ? null : qna.id)
                  }
                >
                  {/* Question Header */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-base font-medium text-sky-100 leading-relaxed flex-1">
                        {qna.question}
                      </p>
                      <div
                        className={`shrink-0 transition-transform duration-300 ${
                          expandedId === qna.id ? "rotate-180" : ""
                        }`}
                      >
                        <svg
                          className="w-5 h-5 text-sky-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Answer (Expandable) */}
                  <AnimatePresence>
                    {expandedId === qna.id && qna.answer && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-5 pb-5 pt-4 border-t border-sky-800/30">
                          <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                            {qna.answer}
                          </p>
                          {/* Metadata shown only when expanded */}
                          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-sky-900/30 text-xs text-slate-500">
                            {qna.asker_name && (
                              <>
                                <span className="text-slate-400">
                                  Asked by {qna.asker_name}
                                </span>
                                {qna.answered_at && <span>•</span>}
                              </>
                            )}
                            {qna.answered_at && (
                              <span>
                                Answered {formatDate(qna.answered_at)}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
