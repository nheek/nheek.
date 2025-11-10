"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Contribution {
  id: number;
  name: string;
  category: string;
  content: string;
  website_url: string | null;
  song_link: string | null;
  show_link: number;
  status: string;
  created_at: string;
  approved_at: string | null;
}

const CATEGORY_LABELS: Record<string, string> = {
  graffiti: "🎨 Graffiti",
  guestbook: "📝 Guestbook",
  song: "🎵 Song",
  star: "⭐ Star Message",
  fortune: "🔮 Fortune",
};

const CATEGORY_COLORS: Record<string, string> = {
  graffiti: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
  guestbook: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  song: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  star: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  fortune:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
};

export default function ContributionsAdmin() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");
  const [message, setMessage] = useState("");

  useEffect(() => {
    checkAuth();
    fetchContributions();
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
    } finally {
      setLoading(false);
    }
  };

  const fetchContributions = async () => {
    try {
      const res = await fetch(`/api/contributions?status=${filter}`);
      const data = await res.json();
      setContributions(data.contributions || []);
    } catch (error) {
      console.error("Failed to fetch contributions:", error);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      const res = await fetch(`/api/contributions/${id}`, {
        method: "PATCH",
      });

      if (res.ok) {
        setMessage("✅ Contribution approved!");
        await fetchContributions();
      } else {
        setMessage("❌ Failed to approve");
      }
    } catch {
      setMessage("❌ Error approving contribution");
    } finally {
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this contribution?")) {
      return;
    }

    try {
      const res = await fetch(`/api/contributions/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setMessage("✅ Contribution deleted!");
        await fetchContributions();
      } else {
        setMessage("❌ Failed to delete");
      }
    } catch {
      setMessage("❌ Error deleting contribution");
    } finally {
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleToggleLink = async (id: number) => {
    try {
      const res = await fetch(`/api/contributions/${id}/toggle-link`, {
        method: "PATCH",
      });

      if (res.ok) {
        setMessage("✅ Link visibility toggled!");
        await fetchContributions();
      } else {
        setMessage("❌ Failed to toggle link");
      }
    } catch {
      setMessage("❌ Error toggling link");
    } finally {
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const pendingCount = contributions.filter(
    (c) => c.status === "pending",
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white shadow dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Visitor Contributions
            </h1>
            <Link
              href="/admin"
              className="rounded-md bg-gray-600 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-500"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {message && (
          <div
            className={`mb-6 rounded-md p-4 ${
              message.startsWith("✅")
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
            }`}
          >
            {message}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
              filter === "all"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            All ({contributions.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
              filter === "pending"
                ? "bg-yellow-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
              filter === "approved"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            Approved (
            {contributions.filter((c) => c.status === "approved").length})
          </button>
        </div>

        {/* Contributions List */}
        {contributions.length === 0 ? (
          <div className="rounded-lg bg-white p-12 text-center shadow dark:bg-gray-800">
            <p className="text-gray-500 dark:text-gray-400">
              No contributions yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {contributions.map((contribution) => (
              <div
                key={contribution.id}
                className="rounded-lg bg-white p-6 shadow dark:bg-gray-800"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${CATEGORY_COLORS[contribution.category]}`}
                      >
                        {CATEGORY_LABELS[contribution.category]}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          contribution.status === "pending"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                            : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                        }`}
                      >
                        {contribution.status}
                      </span>
                    </div>

                    <h3 className="mt-3 text-lg font-semibold text-gray-900 dark:text-white">
                      {contribution.name}
                    </h3>

                    {contribution.category === "graffiti" ||
                    contribution.category === "emoji" ? (
                      <div className="mt-2">
                        <img
                          src={contribution.content}
                          alt={`${contribution.category} by ${contribution.name}`}
                          className="max-w-full max-h-48 rounded-lg border-2 border-gray-300 dark:border-gray-600"
                        />
                      </div>
                    ) : (
                      <p className="mt-2 text-gray-700 dark:text-gray-300">
                        {contribution.content}
                      </p>
                    )}

                    {contribution.website_url && (
                      <div className="mt-2 flex items-center gap-2">
                        <a
                          href={contribution.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block text-sm text-indigo-600 hover:underline dark:text-indigo-400"
                        >
                          🔗 {contribution.website_url}
                        </a>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          (Link {contribution.show_link ? "visible" : "hidden"}{" "}
                          on wall)
                        </span>
                      </div>
                    )}

                    {contribution.song_link && (
                      <a
                        href={contribution.song_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-sm text-purple-600 hover:underline dark:text-purple-400"
                      >
                        🎵 {contribution.song_link}
                      </a>
                    )}

                    <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                      Submitted:{" "}
                      {new Date(contribution.created_at).toLocaleString()}
                    </p>
                    {contribution.approved_at && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Approved:{" "}
                        {new Date(contribution.approved_at).toLocaleString()}
                      </p>
                    )}
                  </div>

                  <div className="ml-4 flex flex-col gap-2">
                    <div className="flex gap-2">
                      {contribution.status === "pending" && (
                        <button
                          onClick={() => handleApprove(contribution.id)}
                          className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-500"
                        >
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(contribution.id)}
                        className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
                      >
                        Delete
                      </button>
                    </div>
                    {contribution.website_url && (
                      <button
                        onClick={() => handleToggleLink(contribution.id)}
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
                      >
                        {contribution.show_link ? "Hide" : "Show"} Link
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
