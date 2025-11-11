"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type QnA = {
  id: number;
  question: string;
  answer: string | null;
  asker_name: string | null;
  status: string;
  created_at: string;
  answered_at: string | null;
};

export default function AdminQnAPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<QnA[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "answered">("all");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [answerText, setAnswerText] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    checkAuth();
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (!res.ok) {
        router.push("/admin/login");
      }
    } catch {
      router.push("/admin/login");
    }
  };

  const fetchQuestions = async () => {
    try {
      const url = filter === "all" ? "/api/qna" : `/api/qna?status=${filter}`;
      const res = await fetch(url);
      const data = await res.json();
      setQuestions(data.questions || []);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (id: number) => {
    if (!answerText.trim()) {
      setMessage("Please enter an answer");
      return;
    }

    try {
      const res = await fetch(`/api/qna/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answer: answerText.trim(),
          status: "answered",
        }),
      });

      if (res.ok) {
        setMessage("✅ Question answered successfully!");
        setEditingId(null);
        setAnswerText("");
        await fetchQuestions();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("❌ Failed to answer question");
      }
    } catch {
      setMessage("❌ Error answering question");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this question?")) {
      return;
    }

    try {
      const res = await fetch(`/api/qna/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setMessage("✅ Question deleted");
        await fetchQuestions();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("❌ Failed to delete question");
      }
    } catch {
      setMessage("❌ Error deleting question");
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredQuestions = questions;
  const pendingCount = questions.filter((q) => q.status === "pending").length;
  const answeredCount = questions.filter((q) => q.status === "answered").length;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white shadow dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Manage Q&A
            </h1>
            <Link
              href="/admin"
              className="rounded-md bg-gray-600 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-500"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow dark:bg-gray-800 sm:p-6">
            <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Questions
            </dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
              {questions.length}
            </dd>
          </div>

          <div className="overflow-hidden rounded-lg bg-yellow-50 px-4 py-5 shadow dark:bg-yellow-900/20 sm:p-6">
            <dt className="truncate text-sm font-medium text-yellow-700 dark:text-yellow-400">
              Pending
            </dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-yellow-900 dark:text-yellow-300">
              {pendingCount}
            </dd>
          </div>

          <div className="overflow-hidden rounded-lg bg-green-50 px-4 py-5 shadow dark:bg-green-900/20 sm:p-6">
            <dt className="truncate text-sm font-medium text-green-700 dark:text-green-400">
              Answered
            </dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-green-900 dark:text-green-300">
              {answeredCount}
            </dd>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-lg px-4 py-2 font-medium transition ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            All ({questions.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`rounded-lg px-4 py-2 font-medium transition ${
              filter === "pending"
                ? "bg-yellow-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilter("answered")}
            className={`rounded-lg px-4 py-2 font-medium transition ${
              filter === "answered"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            Answered ({answeredCount})
          </button>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 rounded-lg p-4 ${
              message.startsWith("✅")
                ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                : "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300"
            }`}
          >
            {message}
          </div>
        )}

        {/* Questions List */}
        {filteredQuestions.length === 0 ? (
          <div className="rounded-lg bg-white p-12 text-center shadow dark:bg-gray-800">
            <p className="text-gray-500 dark:text-gray-400">
              No questions found
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuestions.map((qna) => (
              <div
                key={qna.id}
                className={`rounded-lg bg-white p-6 shadow dark:bg-gray-800 ${
                  qna.status === "pending"
                    ? "border-l-4 border-yellow-500"
                    : "border-l-4 border-green-500"
                }`}
              >
                {/* Question Header */}
                <div className="mb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            qna.status === "pending"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                              : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          }`}
                        >
                          {qna.status.toUpperCase()}
                        </span>
                        {qna.asker_name && (
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Asked by: <strong>{qna.asker_name}</strong>
                          </span>
                        )}
                      </div>
                      <p className="text-lg font-medium text-gray-900 dark:text-white">
                        {qna.question}
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Submitted: {formatDate(qna.created_at)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(qna.id)}
                      className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Existing Answer or Answer Form */}
                {qna.status === "answered" && qna.answer ? (
                  <div className="mt-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Answer:
                    </p>
                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                      {qna.answer}
                    </p>
                    {qna.answered_at && (
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Answered: {formatDate(qna.answered_at)}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="mt-4">
                    {editingId === qna.id ? (
                      <div className="space-y-3">
                        <textarea
                          value={answerText}
                          onChange={(e) => setAnswerText(e.target.value)}
                          rows={4}
                          placeholder="Type your answer..."
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAnswer(qna.id)}
                            className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500"
                          >
                            Submit Answer
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              setAnswerText("");
                            }}
                            className="rounded-md bg-gray-600 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-500"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingId(qna.id);
                          setAnswerText(qna.answer || "");
                        }}
                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                      >
                        Answer Question
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
