"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface CustomLink {
  name: string;
  url: string;
  color: string;
}

interface Album {
  id: number;
  title: string;
  codename: string;
  cover_image: string | null;
  release_date: string;
  custom_links?: string;
  featured: number;
  song_count?: number;
}

export default function AlbumsManagement() {
  const router = useRouter();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    codename: "",
    cover_image: "",
    release_date: "",
    featured: false,
  });
  const [customLinks, setCustomLinks] = useState<CustomLink[]>([]);

  useEffect(() => {
    checkAuth();
    fetchAlbums();
  }, []);

  const checkAuth = async () => {
    const res = await fetch("/api/auth/me");
    if (!res.ok) router.push("/admin/login");
  };

  const fetchAlbums = async () => {
    try {
      const res = await fetch("/api/albums");
      const data = await res.json();
      setAlbums(data.albums || []);
    } catch (error) {
      console.error("Failed to fetch albums:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingAlbum
        ? `/api/albums/${editingAlbum.id}`
        : "/api/albums";
      const method = editingAlbum ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          custom_links: JSON.stringify(customLinks),
        }),
      });

      if (res.ok) {
        setShowModal(false);
        setEditingAlbum(null);
        resetForm();
        fetchAlbums();
      }
    } catch (error) {
      console.error("Failed to save album:", error);
    }
  };

  const handleEdit = (album: Album) => {
    setEditingAlbum(album);
    
    // Format date properly for input type="date" (needs YYYY-MM-DD)
    let formattedDate = "";
    if (album.release_date) {
      try {
        const date = new Date(album.release_date);
        formattedDate = date.toISOString().split("T")[0];
      } catch {
        formattedDate = album.release_date.split("T")[0];
      }
    }
    
    setFormData({
      title: album.title,
      codename: album.codename,
      cover_image: album.cover_image || "",
      release_date: formattedDate,
      featured: album.featured === 1,
    });

    // Parse custom links
    try {
      const links = album.custom_links ? JSON.parse(album.custom_links) : [];
      setCustomLinks(links);
    } catch {
      setCustomLinks([]);
    }

    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this album?")) return;

    try {
      const res = await fetch(`/api/albums/${id}`, { method: "DELETE" });
      if (res.ok) fetchAlbums();
    } catch (error) {
      console.error("Failed to delete album:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      codename: "",
      cover_image: "",
      release_date: "",
      featured: false,
    });
    setCustomLinks([]);
  };

  const addCustomLink = () => {
    setCustomLinks([...customLinks, { name: "", url: "", color: "#6366f1" }]);
  };

  const updateCustomLink = (
    index: number,
    field: keyof CustomLink,
    value: string,
  ) => {
    const updated = [...customLinks];
    updated[index][field] = value;
    setCustomLinks(updated);
  };

  const removeCustomLink = (index: number) => {
    setCustomLinks(customLinks.filter((_, i) => i !== index));
  };

  const filteredAlbums = albums.filter((album) =>
    album.title.toLowerCase().includes(search.toLowerCase()),
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
              Manage Albums
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
            placeholder="Search albums..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-md border px-4 py-2 dark:bg-gray-800 dark:text-white"
          />
          <button
            onClick={() => {
              resetForm();
              setEditingAlbum(null);
              setShowModal(true);
            }}
            className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500"
          >
            Add New Album
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
                  Release Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Songs
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
              {filteredAlbums.map((album) => {
                let links: CustomLink[] = [];
                try {
                  links = album.custom_links
                    ? JSON.parse(album.custom_links)
                    : [];
                } catch {
                  links = [];
                }

                return (
                  <tr key={album.id}>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {album.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {album.codename}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(album.release_date).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {album.song_count || 0}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {links.map((link, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-white"
                            style={{ backgroundColor: link.color }}
                          >
                            {link.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {album.featured === 1 && (
                        <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                          Featured
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(album)}
                        className="mr-2 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(album.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 dark:bg-gray-800">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              {editingAlbum ? "Edit Album" : "Add New Album"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  Cover Image URL
                </label>
                <input
                  type="text"
                  value={formData.cover_image}
                  onChange={(e) =>
                    setFormData({ ...formData, cover_image: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border px-3 py-2 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Release Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.release_date}
                  onChange={(e) =>
                    setFormData({ ...formData, release_date: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border px-3 py-2 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Custom Links Section */}
              <div className="border-t pt-4">
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Streaming Links
                  </label>
                  <button
                    type="button"
                    onClick={addCustomLink}
                    className="rounded-md bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-500"
                  >
                    + Add New Link
                  </button>
                </div>

                {customLinks.length === 0 && (
                  <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
                    No links yet. Click "+ Add New Link" to add streaming platforms.
                  </p>
                )}

                {customLinks.map((link, index) => (
                  <div
                    key={index}
                    className="mb-3 rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                  >
                    <div className="mb-2 grid grid-cols-1 gap-2 md:grid-cols-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                          Platform Name
                        </label>
                        <input
                          type="text"
                          value={link.name}
                          onChange={(e) =>
                            updateCustomLink(index, "name", e.target.value)
                          }
                          placeholder="e.g. Spotify, Apple Music"
                          className="mt-1 block w-full rounded-md border px-2 py-1 text-sm dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                          URL
                        </label>
                        <input
                          type="url"
                          value={link.url}
                          onChange={(e) =>
                            updateCustomLink(index, "url", e.target.value)
                          }
                          placeholder="https://..."
                          className="mt-1 block w-full rounded-md border px-2 py-1 text-sm dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      <div className="flex items-end gap-2">
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                            Color
                          </label>
                          <div className="mt-1 flex gap-2">
                            <input
                              type="color"
                              value={link.color}
                              onChange={(e) =>
                                updateCustomLink(index, "color", e.target.value)
                              }
                              className="h-8 w-12 cursor-pointer rounded"
                            />
                            <input
                              type="text"
                              value={link.color}
                              onChange={(e) =>
                                updateCustomLink(index, "color", e.target.value)
                              }
                              placeholder="#6366f1"
                              className="block w-20 rounded-md border px-2 py-1 text-xs dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeCustomLink(index)}
                          className="rounded-md bg-red-600 px-2 py-1.5 text-xs text-white hover:bg-red-500"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center border-t pt-4">
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

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingAlbum(null);
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
                  {editingAlbum ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
