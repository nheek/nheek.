"use client";

import { useState } from "react";
import ImageLoader from "../utils/ImageLoader";
import { motion, AnimatePresence } from "framer-motion";

type GalleryImage = {
  id: number;
  image_url: string;
  alt_text: string;
  display_order: number;
};

type GalleryProps = {
  initialImages: GalleryImage[];
};

export default function Gallery({ initialImages }: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  if (initialImages.length === 0) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center">
        <p className="text-slate-300/60 text-lg font-serif italic">
          no moments captured yet
        </p>
      </div>
    );
  }

  // Function to determine grid span based on position
  const getGridSpan = (index: number) => {
    const patterns = [
      "col-span-1 row-span-1", // normal
      "col-span-2 row-span-2", // large
      "col-span-1 row-span-2", // tall
      "col-span-2 row-span-1", // wide
    ];
    // Create varied pattern
    if (index % 7 === 0) return patterns[1]; // every 7th is large
    if (index % 5 === 0) return patterns[2]; // every 5th is tall
    if (index % 3 === 0) return patterns[3]; // every 3rd is wide
    return patterns[0]; // default
  };

  return (
    <>
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        {/* <div className="mb-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-serif text-slate-200 mb-2"
          >
            moments
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center gap-2 text-slate-600"
          >
            <span className="text-sm">◆</span>
            <span className="text-sm">◆</span>
            <span className="text-sm">◆</span>
          </motion.div>
        </div> */}

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 auto-rows-[250px] gap-3">
          {initialImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className={`${getGridSpan(index)} relative group cursor-pointer overflow-hidden rounded-xl bg-slate-800/20`}
              onMouseEnter={() => setHoveredId(image.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => setSelectedImage(image)}
            >
              <div className="w-full h-full relative">
                <ImageLoader
                  src={image.image_url}
                  alt={image.alt_text}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Overlay on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${
                    hoveredId === image.id ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white text-sm font-serif line-clamp-2">
                      {image.alt_text}
                    </p>
                  </div>
                </div>

                {/* Corner accent */}
                <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-slate-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative max-w-5xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-slate-300 transition-colors"
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Image */}
              <div className="rounded-xl overflow-hidden shadow-2xl">
                <img
                  src={selectedImage.image_url}
                  alt={selectedImage.alt_text}
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
              </div>

              {/* Caption */}
              <div className="mt-4 text-center">
                <p className="text-slate-200 text-lg font-serif">
                  {selectedImage.alt_text}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
