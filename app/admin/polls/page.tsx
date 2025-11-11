"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type PollOption = {
  id?: number;
  name: string;
  description: string;
  image_url: string;
  link: string;
  vote_count?: number;
  display_order?: number;
};

type Poll = {
  id: number;
  title: string;
  description: string;
  status: string;
  allow_multiple_votes: number;
  end_date: string | null;
  created_at: string;
  options: PollOption[];
  totalVotes: number;
};

export default function AdminPollsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPoll, setEditingPoll] = useState<Poll | null>(null);
  const [message, setMessage] = useState("");

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [endDate, setEndDate] = useState("");
  const [options, setOptions] = useState<PollOption[]>([
    { name: "", description: "", image_url: "", link: "" },
    { name: "", description: "", image_url: "", link: "" },
  ]);

  useEffect(() => {
    checkAuth();
    fetchPolls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const fetchPolls = async () => {
    try {
      const res = await fetch("/api/polls?includeAll=true");
      const data = await res.json();
      setPolls(data);
    } catch (error) {
      console.error("Error fetching polls:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setAllowMultiple(false);
    setEndDate("");
    setOptions([
      { name: "", description: "", image_url: "", link: "" },
      { name: "", description: "", image_url: "", link: "" },
    ]);
    setEditingPoll(null);
    setShowCreateForm(false);
  };

  const handleAddOption = () => {
    setOptions([
      ...options,
      { name: "", description: "", image_url: "", link: "" },
    ]);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (
    index: number,
    field: keyof PollOption,
    value: string,
  ) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setMessage("❌ Please enter a title");
      return;
    }

    const validOptions = options.filter((opt) => opt.name.trim());
    if (validOptions.length < 2) {
      setMessage("❌ Please provide at least 2 options with names");
      return;
    }

    try {
      const body = {
        title: title.trim(),
        description: description.trim(),
        allow_multiple_votes: allowMultiple ? 1 : 0,
        end_date: endDate || null,
        options: validOptions,
      };

      const url = editingPoll ? `/api/polls/${editingPoll.id}` : "/api/polls";
      const method = editingPoll ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setMessage(
          editingPoll
            ? "✅ Poll updated successfully!"
            : "✅ Poll created successfully!",
        );
        await fetchPolls();
        resetForm();
        setTimeout(() => setMessage(""), 3000);
      } else {
        const error = await res.json();
        setMessage(`❌ ${error.error || "Failed to save poll"}`);
      }
    } catch (error) {
      console.error("Error saving poll:", error);
      setMessage("❌ Error saving poll");
    }
  };

  const handleEdit = (poll: Poll) => {
    setTitle(poll.title);
    setDescription(poll.description || "");
    setAllowMultiple(poll.allow_multiple_votes === 1);
    setEndDate(poll.end_date || "");
    setOptions(
      poll.options.map((opt) => ({
        id: opt.id,
        name: opt.name,
        description: opt.description || "",
        image_url: opt.image_url || "",
        link: opt.link || "",
        vote_count: opt.vote_count,
      })),
    );
    setEditingPoll(poll);
    setShowCreateForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this poll?")) {
      return;
    }

    try {
      const res = await fetch(`/api/polls/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setMessage("✅ Poll deleted");
        await fetchPolls();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("❌ Failed to delete poll");
      }
    } catch {
      setMessage("❌ Error deleting poll");
    }
  };

  const handleStatusToggle = async (poll: Poll) => {
    const newStatus = poll.status === "active" ? "ended" : "active";

    try {
      const res = await fetch(`/api/polls/${poll.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...poll,
          status: newStatus,
        }),
      });

      if (res.ok) {
        setMessage(`✅ Poll ${newStatus === "active" ? "activated" : "ended"}`);
        await fetchPolls();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("❌ Failed to update poll status");
      }
    } catch {
      setMessage("❌ Error updating poll status");
    }
  };

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
              Manage Polls
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
        {message && (
          <div className="mb-4 rounded-md bg-blue-50 p-4 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200">
            {message}
          </div>
        )}

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Polls
            </div>
            <div className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
              {polls.length}
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Active Polls
            </div>
            <div className="mt-2 text-3xl font-semibold text-green-600 dark:text-green-400">
              {polls.filter((p) => p.status === "active").length}
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Votes
            </div>
            <div className="mt-2 text-3xl font-semibold text-purple-600 dark:text-purple-400">
              {polls.reduce((sum, p) => sum + p.totalVotes, 0)}
            </div>
          </div>
        </div>

        {/* Create/Edit Form */}
        <div className="mb-8">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
          >
            {showCreateForm ? "Cancel" : "Create New Poll"}
          </button>

          {showCreateForm && (
            <form
              onSubmit={handleSubmit}
              className="mt-4 space-y-6 rounded-lg bg-white p-6 shadow dark:bg-gray-800"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {editingPoll ? "Edit Poll" : "Create New Poll"}
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={allowMultiple}
                    onChange={(e) => setAllowMultiple(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Allow multiple votes
                  </span>
                </label>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    End Date (optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              {/* Options */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Poll Options * (min 2)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400"
                  >
                    + Add Option
                  </button>
                </div>

                <div className="space-y-4">
                  {options.map((option, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-gray-300 p-4 dark:border-gray-600"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          Option {index + 1}
                        </h3>
                        {options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(index)}
                            className="text-sm text-red-600 hover:text-red-700 dark:text-red-400"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs text-gray-600 dark:text-gray-400">
                            Name *
                          </label>
                          <input
                            type="text"
                            value={option.name}
                            onChange={(e) =>
                              handleOptionChange(index, "name", e.target.value)
                            }
                            className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-gray-600 dark:text-gray-400">
                            Image URL
                          </label>
                          <input
                            type="url"
                            value={option.image_url}
                            onChange={(e) =>
                              handleOptionChange(
                                index,
                                "image_url",
                                e.target.value,
                              )
                            }
                            className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-gray-600 dark:text-gray-400">
                            Description
                          </label>
                          <input
                            type="text"
                            value={option.description}
                            onChange={(e) =>
                              handleOptionChange(
                                index,
                                "description",
                                e.target.value,
                              )
                            }
                            className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-gray-600 dark:text-gray-400">
                            Link URL
                          </label>
                          <input
                            type="url"
                            value={option.link}
                            onChange={(e) =>
                              handleOptionChange(index, "link", e.target.value)
                            }
                            className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
                >
                  {editingPoll ? "Update Poll" : "Create Poll"}
                </button>
                {editingPoll && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}
        </div>

        {/* Polls List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            All Polls
          </h2>

          {polls.length === 0 ? (
            <div className="rounded-lg bg-white p-12 text-center shadow dark:bg-gray-800">
              <p className="text-gray-500 dark:text-gray-400">
                No polls yet. Create your first poll!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {polls.map((poll) => (
                <div
                  key={poll.id}
                  className="rounded-lg bg-white p-6 shadow dark:bg-gray-800"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {poll.title}
                        </h3>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            poll.status === "active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400"
                          }`}
                        >
                          {poll.status}
                        </span>
                      </div>
                      {poll.description && (
                        <p className="mt-1 text-gray-600 dark:text-gray-400">
                          {poll.description}
                        </p>
                      )}
                      <div className="mt-2 text-sm text-gray-500 dark:text-gray-500">
                        {poll.totalVotes} total votes •{" "}
                        {poll.allow_multiple_votes === 1
                          ? "Multiple votes allowed"
                          : "Single vote only"}
                        {poll.end_date &&
                          ` • Ends ${new Date(poll.end_date).toLocaleDateString()}`}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(poll)}
                        className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleStatusToggle(poll)}
                        className={`rounded-md px-3 py-1 text-sm text-white ${
                          poll.status === "active"
                            ? "bg-yellow-600 hover:bg-yellow-700"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {poll.status === "active" ? "End" : "Activate"}
                      </button>
                      <button
                        onClick={() => handleDelete(poll.id)}
                        className="rounded-md bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Options with results */}
                  <div className="mt-4 space-y-2">
                    {poll.options.map((option) => {
                      const percentage =
                        poll.totalVotes > 0
                          ? (
                              (option.vote_count! / poll.totalVotes) *
                              100
                            ).toFixed(1)
                          : "0.0";

                      return (
                        <div
                          key={option.id}
                          className="rounded-md border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-700/50"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {option.name}
                              </span>
                              {option.description && (
                                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                                  {option.description}
                                </span>
                              )}
                            </div>
                            <div className="text-right">
                              <span className="font-semibold text-purple-600 dark:text-purple-400">
                                {percentage}%
                              </span>
                              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                                ({option.vote_count} votes)
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
