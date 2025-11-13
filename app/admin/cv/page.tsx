"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminCVPage() {
  const [cv, setCV] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    id: undefined,
    company: "",
    position: "",
    date_from: "",
    date_to: "",
    present: false,
    link: "",
    description: "",
    location: "",
  });

  async function fetchCV() {
    setLoading(true);
    const res = await fetch("/api/cv");
    const data = await res.json();
    setCV(data.cv || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchCV();
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    const method = editId ? "PUT" : "POST";
    const payload = { ...form };
    if (editId) payload.id = editId;
    await fetch("/api/cv", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setForm({
      id: undefined,
      company: "",
      position: "",
      date_from: "",
      date_to: "",
      present: false,
      link: "",
      description: "",
      location: "",
    });
    setEditId(null);
    setShowModal(false);
    fetchCV();
    // Revalidate the CV page cache
    await fetch("/api/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: "/cv" }),
    });
  }

  async function handleDelete(id) {
    await fetch("/api/cv", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchCV();
    // Revalidate the CV page cache
    await fetch("/api/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: "/cv" }),
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white shadow dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Manage CV / Resume
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
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-2">
          <button
            className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500"
            onClick={() => {
              setEditId(null);
              setForm({
                id: undefined,
                company: "",
                position: "",
                date_from: "",
                date_to: "",
                present: false,
                link: "",
                description: "",
                location: "",
              });
              setShowModal(true);
            }}
          >
            Add New Entry
          </button>
          <button
            className="rounded-md bg-cyan-700 px-4 py-2 text-white hover:bg-cyan-600"
            onClick={async () => {
              try {
                const res = await fetch("/api/revalidate", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ path: "/cv" }),
                });
                if (res.ok) {
                  alert("✅ CV cache cleared!");
                } else {
                  alert("❌ Failed to clear CV cache");
                }
              } catch {
                alert("❌ Error clearing CV cache");
              }
            }}
          >
            Clear CV Cache
          </button>
        </div>
        <div className="overflow-x-auto rounded-lg bg-white shadow dark:bg-gray-800">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  From
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Link
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Description
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : (
                cv.map((entry) => (
                  <tr key={entry.id}>
                    <td className="whitespace-nowrap px-6 py-4">
                      {entry.company}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {entry.position}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {entry.date_from}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {entry.present ? "Present" : entry.date_to}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {entry.location}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <a
                        href={entry.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        {entry.link}
                      </a>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-500 dark:text-gray-400">
                      {entry.description}
                    </td>
                    <td
                      className="whitespace-nowrap px-6 py-4 text-right sticky right-0 bg-white dark:bg-gray-800 z-10"
                      style={{ minWidth: 120 }}
                    >
                      <div className="flex justify-end gap-2">
                        <button
                          className="rounded-md bg-indigo-600 px-3 py-1 text-white hover:bg-indigo-500 shadow"
                          onClick={() => {
                            setEditId(entry.id);
                            setForm({ ...entry });
                            setShowModal(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="rounded-md bg-red-600 px-3 py-1 text-white hover:bg-red-500 shadow"
                          onClick={() => handleDelete(entry.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 dark:bg-gray-800">
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                {editId ? "Edit Entry" : "Add New Entry"}
              </h2>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Company *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.company}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, company: e.target.value }))
                    }
                    className="mt-1 block w-full rounded-md border px-3 py-2 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Position *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.position}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, position: e.target.value }))
                    }
                    className="mt-1 block w-full rounded-md border px-3 py-2 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Date From *
                    </label>
                    <input
                      type="date"
                      required
                      value={form.date_from}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, date_from: e.target.value }))
                      }
                      className="mt-1 block w-full rounded-md border px-3 py-2 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Date To
                    </label>
                    <input
                      type="date"
                      value={form.date_to}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, date_to: e.target.value }))
                      }
                      className="mt-1 block w-full rounded-md border px-3 py-2 dark:bg-gray-700 dark:text-white"
                      disabled={form.present}
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
                      Present
                    </label>
                    <input
                      type="checkbox"
                      checked={form.present}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          present: e.target.checked,
                          date_to: "",
                        }))
                      }
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Location
                  </label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, location: e.target.value }))
                    }
                    className="mt-1 block w-full rounded-md border px-3 py-2 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Link
                  </label>
                  <input
                    type="url"
                    value={form.link}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, link: e.target.value }))
                    }
                    className="mt-1 block w-full rounded-md border px-3 py-2 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, description: e.target.value }))
                    }
                    rows={3}
                    className="mt-1 block w-full rounded-md border px-3 py-2 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div className="flex justify-end space-x-2 border-t pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditId(null);
                      setForm({
                        id: undefined,
                        company: "",
                        position: "",
                        date_from: "",
                        date_to: "",
                        present: false,
                        link: "",
                        description: "",
                        location: "",
                      });
                    }}
                    className="rounded-md bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500"
                  >
                    {editId ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
