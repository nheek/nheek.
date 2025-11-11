"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

type GalleryImage = {
  id: number;
  image_url: string;
  alt_text: string;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form state
  const [imageUrl, setImageUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [displayOrder, setDisplayOrder] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [clearingCache, setClearingCache] = useState(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/gallery");
      if (!response.ok) throw new Error("Failed to fetch images");
      const data = await response.json();
      setImages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load images");
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
        image_url: imageUrl,
        alt_text: altText,
        display_order: displayOrder ? parseInt(displayOrder) : undefined,
      };

      let response;
      if (editingId) {
        response = await fetch(`/api/gallery/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save image");
      }

      // Reset form and close modal
      setImageUrl("");
      setAltText("");
      setDisplayOrder("");
      setEditingId(null);
      setIsModalOpen(false);

      // Refresh images
      await fetchImages();
      alert(editingId ? "Image updated!" : "Image added!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save image");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (image: GalleryImage) => {
    setEditingId(image.id);
    setImageUrl(image.image_url);
    setAltText(image.alt_text);
    setDisplayOrder(image.display_order.toString());
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingId(null);
    setImageUrl("");
    setAltText("");
    setDisplayOrder("");
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete image");
      }

      await fetchImages();
      alert("Image deleted!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete image");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setImageUrl("");
    setAltText("");
    setDisplayOrder("");
    setIsModalOpen(false);
  };

  const handleClearCache = async () => {
    if (
      !confirm(
        "Clear the gallery page cache? This will refresh the public gallery page.",
      )
    )
      return;

    setClearingCache(true);
    try {
      const response = await fetch("/api/gallery/revalidate", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to clear cache");
      }

      alert("Gallery cache cleared! The public page will show updated images.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to clear cache");
    } finally {
      setClearingCache(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Gallery Management</h1>
          <div className="flex gap-3">
            <button
              onClick={handleClearCache}
              disabled={clearingCache}
              className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded disabled:opacity-50"
            >
              {clearingCache ? "Clearing..." : "🔄 Clear Cache"}
            </button>
            <Link
              href="/admin"
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
            >
              ← Back to Admin
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded mb-6">
            {error}
          </div>
        )}

        {/* Add Image Button */}
        <div className="mb-8">
          <button
            onClick={openAddModal}
            className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded font-semibold"
          >
            + Add New Image
          </button>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {editingId ? "Edit Image" : "Add New Image"}
                </h2>
                <button
                  onClick={cancelEdit}
                  className="text-gray-400 hover:text-white text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Image URL *
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-sm text-gray-400 mt-1">
                    Full URL to the image
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Alt Text / Description *
                  </label>
                  <input
                    type="text"
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    placeholder="Description of the image"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Display Order (optional)
                  </label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    placeholder="Leave empty to add at the end"
                  />
                  <p className="text-sm text-gray-400 mt-1">
                    Lower numbers appear first
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded disabled:opacity-50"
                  >
                    {submitting
                      ? "Saving..."
                      : editingId
                        ? "Update Image"
                        : "Add Image"}
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

        {/* Images List */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">
            Current Images ({images.length})
          </h2>

          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : images.length === 0 ? (
            <p className="text-gray-400">
              No images yet. Add your first image above!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="bg-gray-700 rounded-lg overflow-hidden"
                >
                  <div className="relative w-full h-48">
                    <Image
                      src={image.image_url}
                      alt={image.alt_text}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      unoptimized
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-300 mb-2">
                      {image.alt_text}
                    </p>
                    <p className="text-xs text-gray-500 mb-3">
                      Order: {image.display_order}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(image)}
                        className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(image.id)}
                        className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded text-sm"
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
