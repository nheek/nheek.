"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

type Song = {
  title: string;
  link?: string;
};

type Film = {
  id: number;
  title: string;
  type: "film" | "series";
  cover_image_url: string | null;
  rating: number | null;
  review: string | null;
  release_year: number | null;
  genre: string | null;
  director: string | null;
  duration: string | null;
  episode_count: number | null;
  watch_date: string | null;
  songs: string | null; // JSON string of Song[]
  featured: number;
  display_order: number | null;
  created_at: string;
  updated_at: string;
};

export default function AdminFilmsPage() {
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form state
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"film" | "series">("film");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [rating, setRating] = useState("");
  const [review, setReview] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [genre, setGenre] = useState("");
  const [director, setDirector] = useState("");
  const [duration, setDuration] = useState("");
  const [episodeCount, setEpisodeCount] = useState("");
  const [watchDate, setWatchDate] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);
  const [featured, setFeatured] = useState(false);
  const [displayOrder, setDisplayOrder] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchFilms();
  }, []);

  const fetchFilms = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/films");
      if (!response.ok) throw new Error("Failed to fetch films");
      const data = await response.json();
      setFilms(data.films);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load films");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const payload = {
        title,
        type,
        cover_image_url: coverImageUrl || null,
        rating: rating ? parseFloat(rating) : null,
        review: review || null,
        release_year: releaseYear ? parseInt(releaseYear) : null,
        genre: genre || null,
        director: director || null,
        duration: duration || null,
        episode_count: episodeCount ? parseInt(episodeCount) : null,
        watch_date: watchDate || null,
        songs: songs.length > 0 ? JSON.stringify(songs) : null,
        featured,
        display_order: displayOrder ? parseInt(displayOrder) : null,
      };

      let response;
      if (editingId) {
        response = await fetch(`/api/films/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch("/api/films", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save film");
      }

      // Reset form and close modal
      resetForm();
      setIsModalOpen(false);

      // Refresh films
      await fetchFilms();
      alert(editingId ? "Film updated!" : "Film added!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save film");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (film: Film) => {
    setEditingId(film.id);
    setTitle(film.title);
    setType(film.type);
    setCoverImageUrl(film.cover_image_url || "");
    setRating(film.rating?.toString() || "");
    setReview(film.review || "");
    setReleaseYear(film.release_year?.toString() || "");
    setGenre(film.genre || "");
    setDirector(film.director || "");
    setDuration(film.duration || "");
    setEpisodeCount(film.episode_count?.toString() || "");
    setWatchDate(film.watch_date || "");
    try {
      setSongs(film.songs ? JSON.parse(film.songs) : []);
    } catch {
      setSongs([]);
    }
    setFeatured(film.featured === 1);
    setDisplayOrder(film.display_order?.toString() || "");
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this film?")) return;

    try {
      const response = await fetch(`/api/films/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete film");
      }

      await fetchFilms();
      alert("Film deleted!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete film");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setType("film");
    setCoverImageUrl("");
    setRating("");
    setReview("");
    setReleaseYear("");
    setGenre("");
    setDirector("");
    setDuration("");
    setEpisodeCount("");
    setWatchDate("");
    setSongs([]);
    setFeatured(false);
    setDisplayOrder("");
  };

  const cancelEdit = () => {
    resetForm();
    setIsModalOpen(false);
  };

  const renderStars = (rating: number | null) => {
    if (!rating) return "No rating";
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push("★");
    }
    if (hasHalfStar) {
      stars.push("½");
    }
    return stars.join("") + ` (${rating}/5)`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Films & Series Management</h1>
          <Link
            href="/admin"
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
          >
            ← Back to Admin
          </Link>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded mb-6">
            {error}
          </div>
        )}

        {/* Add Film Button */}
        <div className="mb-8 flex gap-4">
          <button
            onClick={openAddModal}
            className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded font-semibold"
          >
            + Add New Film/Series
          </button>
          <button
            onClick={async () => {
              if (
                !confirm(
                  "Clear cache for all films/series pages? This will refresh the content on the public pages.",
                )
              )
                return;
              try {
                const response = await fetch("/api/revalidate", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ path: "/watch" }),
                });
                if (response.ok) {
                  alert("Cache cleared successfully!");
                } else {
                  alert("Failed to clear cache");
                }
              } catch (err) {
                alert("Error clearing cache");
              }
            }}
            className="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded font-semibold"
          >
            🔄 Clear Films Cache
          </button>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {editingId ? "Edit Film/Series" : "Add New Film/Series"}
                </h2>
                <button
                  onClick={cancelEdit}
                  className="text-gray-400 hover:text-white text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      placeholder="Film/Series title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Type *
                    </label>
                    <select
                      value={type}
                      onChange={(e) =>
                        setType(e.target.value as "film" | "series")
                      }
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    >
                      <option value="film">Film</option>
                      <option value="series">Series</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Rating (0-5, half stars allowed)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="5"
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      placeholder="e.g., 4.5"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Cover Image URL
                    </label>
                    <input
                      type="url"
                      value={coverImageUrl}
                      onChange={(e) => setCoverImageUrl(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      placeholder="https://example.com/poster.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Release Year
                    </label>
                    <input
                      type="number"
                      value={releaseYear}
                      onChange={(e) => setReleaseYear(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      placeholder="2024"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Genre
                    </label>
                    <input
                      type="text"
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      placeholder="Drama, Action, Comedy..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Director
                    </label>
                    <input
                      type="text"
                      value={director}
                      onChange={(e) => setDirector(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      placeholder="Director name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {type === "film" ? "Duration" : "Episode Count"}
                    </label>
                    {type === "film" ? (
                      <input
                        type="text"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                        placeholder="2h 15min"
                      />
                    ) : (
                      <input
                        type="number"
                        value={episodeCount}
                        onChange={(e) => setEpisodeCount(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                        placeholder="10"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Watch Date
                    </label>
                    <input
                      type="date"
                      value={watchDate}
                      onChange={(e) => setWatchDate(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={displayOrder}
                      onChange={(e) => setDisplayOrder(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      placeholder="Leave empty for auto"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Review/Notes
                    </label>
                    <textarea
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      rows={4}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      placeholder="Your thoughts about this film/series..."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Songs I Liked
                    </label>
                    <div className="space-y-3">
                      {songs.map((song, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={song.title}
                            onChange={(e) => {
                              const newSongs = [...songs];
                              newSongs[index].title = e.target.value;
                              setSongs(newSongs);
                            }}
                            placeholder="Song Title"
                            className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                          />
                          <input
                            type="url"
                            value={song.link || ""}
                            onChange={(e) => {
                              const newSongs = [...songs];
                              newSongs[index].link = e.target.value;
                              setSongs(newSongs);
                            }}
                            placeholder="https://open.spotify.com/track/..."
                            className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newSongs = songs.filter(
                                (_, i) => i !== index,
                              );
                              setSongs(newSongs);
                            }}
                            className="px-3 py-2 bg-red-600 hover:bg-red-500 rounded text-white"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          setSongs([...songs, { title: "", link: "" }])
                        }
                        className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded text-white"
                      >
                        + Add Song
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={featured}
                        onChange={(e) => setFeatured(e.target.checked)}
                        className="w-5 h-5"
                      />
                      <span className="text-sm font-medium">
                        Featured (show in featured section)
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded disabled:opacity-50"
                  >
                    {submitting
                      ? "Saving..."
                      : editingId
                        ? "Update Film"
                        : "Add Film"}
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="bg-gray-600 hover:bg-gray-500 px-6 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Films List */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">
            All Films & Series ({films.length})
          </h2>

          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : films.length === 0 ? (
            <p className="text-gray-400">
              No films yet. Add your first film above!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {films.map((film) => (
                <div
                  key={film.id}
                  className="bg-gray-700 rounded-lg overflow-hidden"
                >
                  {film.cover_image_url && (
                    <div className="relative w-full h-64">
                      <Image
                        src={film.cover_image_url}
                        alt={film.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-gray-600 px-2 py-1 rounded">
                        {film.type}
                      </span>
                      {film.featured === 1 && (
                        <span className="text-xs bg-blue-600 px-2 py-1 rounded">
                          FEATURED
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {film.title}
                    </h3>
                    {film.release_year && (
                      <p className="text-sm text-gray-400 mb-2">
                        {film.release_year}
                      </p>
                    )}
                    <p className="text-sm text-yellow-400 mb-2">
                      {renderStars(film.rating)}
                    </p>
                    {film.review && (
                      <p className="text-xs text-gray-400 mb-3 line-clamp-2">
                        {film.review}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(film)}
                        className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-sm flex-1"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(film.id)}
                        className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded text-sm flex-1"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
