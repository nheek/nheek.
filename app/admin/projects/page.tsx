"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Project {
  id: number;
  title: string;
  codename: string;
  description: string | null;
  category_id: number | null;
  category_name?: string;
  image_url: string | null;
  github_link: string | null;
  live_link: string | null;
  featured: number;
  display_order: number;
  date_added: string | null;
}

interface Category {
  id: number;
  name: string;
}

export default function ProjectsManagement() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    codename: "",
    description: "",
    category_id: "",
    image_url: "",
    github_link: "",
    live_link: "",
    featured: false,
    display_order: 0,
    date_added: "",
  });

  useEffect(() => {
    checkAuth();
    fetchProjects();
    fetchCategories();
  }, []);

  const checkAuth = async () => {
    const res = await fetch("/api/auth/me");
    if (!res.ok) router.push("/admin/login");
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingProject
        ? `/api/projects/${editingProject.id}`
        : "/api/projects";
      const method = editingProject ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          category_id: formData.category_id
            ? parseInt(formData.category_id)
            : null,
          display_order: parseInt(formData.display_order.toString()),
        }),
      });

      if (res.ok) {
        setShowModal(false);
        setEditingProject(null);
        resetForm();
        fetchProjects();
      }
    } catch (error) {
      console.error("Failed to save project:", error);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);

    // Format date for input field (YYYY-MM-DD)
    let dateForInput = "";
    if (project.date_added) {
      try {
        const date = new Date(project.date_added);
        dateForInput = date.toISOString().split("T")[0];
      } catch (e) {
        dateForInput = "";
      }
    }

    setFormData({
      title: project.title,
      codename: project.codename,
      description: project.description || "",
      category_id: project.category_id?.toString() || "",
      image_url: project.image_url || "",
      github_link: project.github_link || "",
      live_link: project.live_link || "",
      featured: project.featured === 1,
      display_order: project.display_order,
      date_added: dateForInput,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) fetchProjects();
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      codename: "",
      description: "",
      category_id: "",
      image_url: "",
      github_link: "",
      live_link: "",
      featured: false,
      display_order: 0,
      date_added: "",
    });
  };

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white shadow dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Manage Projects
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
        <div className="mb-6 flex items-center justify-between">
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-md border px-4 py-2 dark:bg-gray-800 dark:text-white"
          />
          <button
            onClick={() => {
              resetForm();
              setEditingProject(null);
              setShowModal(true);
            }}
            className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500"
          >
            Add New Project
          </button>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Date Added
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Links
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Featured
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
              {filteredProjects.map((project) => (
                <tr key={project.id}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {project.title}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {project.codename}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {project.category_name || "Uncategorized"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {project.date_added
                      ? new Date(project.date_added).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {project.github_link && (
                      <span className="mr-2 text-gray-600 dark:text-gray-400">
                        GitHub
                      </span>
                    )}
                    {project.live_link && (
                      <span className="text-gray-600 dark:text-gray-400">
                        Live
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {project.featured === 1 && (
                      <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                        Featured
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(project)}
                      className="mr-2 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6 dark:bg-gray-800">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              {editingProject ? "Edit Project" : "Add New Project"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border px-3 py-2 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Codename *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.codename}
                    onChange={(e) =>
                      setFormData({ ...formData, codename: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border px-3 py-2 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Category
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) =>
                      setFormData({ ...formData, category_id: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border px-3 py-2 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Uncategorized</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        display_order: parseInt(e.target.value),
                      })
                    }
                    className="mt-1 block w-full rounded-md border px-3 py-2 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Date Added
                  </label>
                  <input
                    type="date"
                    value={formData.date_added}
                    onChange={(e) =>
                      setFormData({ ...formData, date_added: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border px-3 py-2 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border px-3 py-2 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Image URL
                </label>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) =>
                    setFormData({ ...formData, image_url: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border px-3 py-2 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  GitHub Link
                </label>
                <input
                  type="text"
                  value={formData.github_link}
                  onChange={(e) =>
                    setFormData({ ...formData, github_link: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border px-3 py-2 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Live Demo Link
                </label>
                <input
                  type="text"
                  value={formData.live_link}
                  onChange={(e) =>
                    setFormData({ ...formData, live_link: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border px-3 py-2 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Featured
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingProject(null);
                    resetForm();
                  }}
                  className="rounded-md bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500"
                >
                  {editingProject ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
