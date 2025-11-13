"use client";
"use client";
import { useState, useEffect } from "react";

export default function SkillsAdminPage() {
  const [skills, setSkills] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  async function fetchSkills() {
    const res = await fetch("/api/skills");
    const data = await res.json();
    setSkills(data.skills || []);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (editingId) {
      await fetch(`/api/skills/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
    } else {
      await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
    }
    setName("");
    setDescription("");
    setEditingId(null);
    fetchSkills();
  }

  async function handleEdit(skill) {
    setName(skill.name);
    setDescription(skill.description);
    setEditingId(skill.id);
  }

  async function handleDelete(id) {
    await fetch(`/api/skills/${id}`, { method: "DELETE" });
    fetchSkills();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white shadow dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Manage Skills
          </h1>
          <a
            href="/admin"
            className="inline-block bg-gray-700 text-white px-4 py-2 rounded shadow hover:bg-gray-800 transition"
          >
            Back to Admin
          </a>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-lg bg-white dark:bg-gray-800 shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-green-700 dark:text-green-400">
            Add or Edit Skill
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Skill name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border px-3 py-2 rounded w-full"
              required
            />
            <textarea
              placeholder="Description (optional, you can write paragraphs)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border px-3 py-2 rounded w-full min-h-[100px] resize-vertical"
              rows={4}
            />
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded shadow hover:bg-green-700 transition"
              >
                {editingId ? "Update" : "Add"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setName("");
                    setDescription("");
                  }}
                  className="px-6 py-2 border rounded shadow"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
        <div className="rounded-lg bg-white dark:bg-gray-800 shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-green-700 dark:text-green-400">
            Skills List
          </h2>
          <ul>
            {skills.map((skill) => (
              <li
                key={skill.id}
                className="mb-4 flex items-center justify-between border-b pb-2"
              >
                <span>
                  <strong className="text-lg text-gray-900 dark:text-white">
                    {skill.name}
                  </strong>
                  {skill.description && (
                    <span className="ml-2 text-gray-500 whitespace-pre-line">
                      {skill.description}
                    </span>
                  )}
                </span>
                <span>
                  <button
                    onClick={() => handleEdit(skill)}
                    className="px-4 py-1 text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(skill.id)}
                    className="px-4 py-1 text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
