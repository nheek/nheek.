"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface CustomLink {
  name: string;
  url: string;
  color: string;
}

interface Song {
  id: number;
  album_id: number;
  title: string;
  codename: string;
  duration: string;
  spotify_link: string | null;
  apple_music_link: string | null;
  custom_links: string | null;
  lyrics: string | null;
  track_order: number;
  album_title?: string;
}

interface Album {
  id: number;
  title: string;
}

export default function SongsManagement() {
  const router = useRouter();
  const [songs, setSongs] = useState<Song[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterAlbum, setFilterAlbum] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [customLinks, setCustomLinks] = useState<CustomLink[]>([]);
  const [formData, setFormData] = useState({
    album_id: "",
    title: "",
    codename: "",
    duration: "",
    spotify_link: "",
    apple_music_link: "",
    lyrics: "",
    track_order: 1,
  });

  useEffect(() => {
    checkAuth();
    fetchSongs();
    fetchAlbums();
  }, []);

  const checkAuth = async () => {
    const res = await fetch("/api/auth/me");
    if (!res.ok) router.push("/admin/login");
  };

  const fetchSongs = async () => {
    try {
      const res = await fetch("/api/songs");
      const data = await res.json();
      setSongs(data.songs || []);
    } catch (error) {
      console.error("Failed to fetch songs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAlbums = async () => {
    try {
      const res = await fetch("/api/albums");
      const data = await res.json();
      setAlbums(data.albums || []);
    } catch (error) {
      console.error("Failed to fetch albums:", error);
    }
  };

  const addCustomLink = () => {
    setCustomLinks([
      ...customLinks,
      { name: "", url: "", color: "#6366f1" },
    ]);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingSong ? `/api/songs/${editingSong.id}` : "/api/songs";
      const method = editingSong ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          album_id: parseInt(formData.album_id),
          track_order: parseInt(formData.track_order.toString()),
          custom_links: JSON.stringify(customLinks),
        }),
      });

      if (res.ok) {
        setShowModal(false);
        setEditingSong(null);
        resetForm();
        fetchSongs();
      }
    } catch (error) {
      console.error("Failed to save song:", error);
    }
  };

  const handleEdit = (song: Song) => {
    setEditingSong(song);

    // Parse existing custom links
    let existingLinks: CustomLink[] = [];
    if (song.custom_links) {
      try {
        existingLinks = JSON.parse(song.custom_links);
      } catch (e) {
        existingLinks = [];
      }
    }
    setCustomLinks(existingLinks);

    setFormData({
      album_id: song.album_id.toString(),
      title: song.title,
      codename: song.codename,
      duration: song.duration,
      spotify_link: song.spotify_link || "",
      apple_music_link: song.apple_music_link || "",
      lyrics: song.lyrics || "",
      track_order: song.track_order,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this song?")) return;

    try {
      const res = await fetch(`/api/songs/${id}`, { method: "DELETE" });
      if (res.ok) fetchSongs();
    } catch (error) {
      console.error("Failed to delete song:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      album_id: "",
      title: "",
      codename: "",
      duration: "",
      spotify_link: "",
      apple_music_link: "",
      lyrics: "",
      track_order: 1,
    });
    setCustomLinks([]);
  };

  const filteredSongs = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(search.toLowerCase()) &&
      (filterAlbum === "" || song.album_id.toString() === filterAlbum),
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
              Manage Songs
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
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search songs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-md border px-4 py-2 dark:bg-gray-800 dark:text-white"
            />
            <select
              value={filterAlbum}
              onChange={(e) => setFilterAlbum(e.target.value)}
              className="rounded-md border px-4 py-2 dark:bg-gray-800 dark:text-white"
            >
              <option value="">All Albums</option>
              {albums.map((album) => (
                <option key={album.id} value={album.id}>
                  {album.title}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => {
              resetForm();
              setEditingSong(null);
              setShowModal(true);
            }}
            className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500"
          >
            Add New Song
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
                  Album
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Links
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Lyrics
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
              {filteredSongs.map((song) => (
                <tr key={song.id}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {song.title}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {song.codename}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {song.album_title}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {song.duration}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {song.custom_links &&
                        (() => {
                          try {
                            const links = JSON.parse(song.custom_links);
                            return links.map(
                              (link: CustomLink, idx: number) => (
                                <span
                                  key={idx}
                                  className="inline-flex rounded-full px-2 py-1 text-xs font-semibold text-white"
                                  style={{ backgroundColor: link.color }}
                                >
                                  {link.name}
                                </span>
                              ),
                            );
                          } catch {
                            return null;
                          }
                        })()}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {song.lyrics ? (
                      <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                        Yes
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-gray-100 px-2 text-xs font-semibold leading-5 text-gray-800">
                        No
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(song)}
                      className="mr-2 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(song.id)}
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
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-6 dark:bg-gray-800">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              {editingSong ? "Edit Song" : "Add New Song"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Album *
                  </label>
                  <select
                    required
                    value={formData.album_id}
                    onChange={(e) =>
                      setFormData({ ...formData, album_id: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border px-3 py-2 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select Album</option>
                    {albums.map((album) => (
                      <option key={album.id} value={album.id}>
                        {album.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Track Order *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.track_order}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        track_order: parseInt(e.target.value),
                      })
                    }
                    className="mt-1 block w-full rounded-md border px-3 py-2 dark:bg-gray-700 dark:text-white"
                  />
                </div>

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
                    Duration (M:SS) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="3:45"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border px-3 py-2 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Custom Links Section */}
              <div className="border-t pt-4">
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Music Platform Links
                  </label>
                  <button
                    type="button"
                    onClick={addCustomLink}
                    className="rounded-md bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-500"
                  >
                    + Add New Link
                  </button>
                </div>

                {customLinks.map((link, index) => (
                  <div
                    key={index}
                    className="mb-3 grid grid-cols-1 gap-2 rounded-lg border border-gray-300 p-3 dark:border-gray-600 md:grid-cols-12"
                  >
                    <div className="md:col-span-3">
                      <input
                        type="text"
                        placeholder="Platform name (e.g., Spotify)"
                        value={link.name}
                        onChange={(e) =>
                          updateCustomLink(index, "name", e.target.value)
                        }
                        className="block w-full rounded-md border px-3 py-2 text-sm dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div className="md:col-span-5">
                      <input
                        type="url"
                        placeholder="https://..."
                        value={link.url}
                        onChange={(e) =>
                          updateCustomLink(index, "url", e.target.value)
                        }
                        className="block w-full rounded-md border px-3 py-2 text-sm dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={link.color}
                          onChange={(e) =>
                            updateCustomLink(index, "color", e.target.value)
                          }
                          className="h-10 w-12 cursor-pointer rounded border"
                        />
                        <input
                          type="text"
                          placeholder="#6366f1"
                          value={link.color}
                          onChange={(e) =>
                            updateCustomLink(index, "color", e.target.value)
                          }
                          className="block w-full rounded-md border px-3 py-2 text-sm dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-1">
                      <button
                        type="button"
                        onClick={() => removeCustomLink(index)}
                        className="w-full rounded-md bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-500"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}

                {customLinks.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No links added yet. Click &quot;+ Add New Link&quot; to add
                    streaming platform links.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Lyrics
                </label>
                <textarea
                  rows={15}
                  value={formData.lyrics}
                  onChange={(e) =>
                    setFormData({ ...formData, lyrics: e.target.value })
                  }
                  placeholder="Enter lyrics here... (use line breaks for new lines)"
                  className="mt-1 block w-full rounded-md border px-3 py-2 font-mono text-sm dark:bg-gray-700 dark:text-white"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Tip: Copy and paste your lyrics with proper line breaks
                </p>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingSong(null);
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
                  {editingSong ? "Update Song" : "Create Song"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
