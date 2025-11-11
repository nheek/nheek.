"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import FooterHero from "../../components/FooterHero";
import Navigate from "../../components/Navigate";

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
  featured: number;
  display_order: number | null;
};

type WatchPageClientProps = {
  featuredFilms: Film[];
  regularFilms: Film[];
};

export default function WatchPageClient({
  featuredFilms,
  regularFilms,
}: WatchPageClientProps) {
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    
    // Cleanup function to ensure scroll is always re-enabled
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const openModal = (film: Film) => {
    setSelectedFilm(film);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedFilm(null);
    document.body.style.overflow = "unset";
  };

  const renderStars = (rating: number | null) => {
    if (!rating) return null;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={`full-${i}`} className="text-yellow-400">
          ★
        </span>,
      );
    }
    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-yellow-400">
          ½
        </span>,
      );
    }
    // Fill remaining with empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-gray-600">
          ★
        </span>,
      );
    }
    return <div className="flex items-center gap-1">{stars}</div>;
  };

  return (
    <div className="min-h-screen bg-[#3d0814]">
      <Header themeColor="#f08080" compact />

      {/* Main Content */}
      <main>
        <div className="w-[85%] mx-auto mt-6 mb-20">
          <h2 className="text-2xl md:text-[3rem] xl:text-[4rem] text-center mb-8">
            films & series
          </h2>

          {/* Featured Films Section */}
          {featuredFilms.length > 0 && (
            <div className="mb-20">
              <h3 className="text-lg text-[#f08080] font-light mb-8 text-center tracking-wide">
                Featured
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {featuredFilms.map((film) => (
                  <div
                    key={film.id}
                    className="group cursor-pointer relative"
                    onClick={() => openModal(film)}
                  >
                    <div className="relative rounded-lg overflow-hidden hover:opacity-90 transition-opacity">
                      {film.cover_image_url ? (
                        <div className="relative w-full aspect-[2/3]">
                          <Image
                            src={film.cover_image_url}
                            alt={film.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      ) : (
                        <div className="w-full aspect-[2/3] bg-gray-900 flex items-center justify-center">
                          <span className="text-gray-600 text-5xl">🎬</span>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                        <h3 className="text-sm font-medium text-white line-clamp-2">
                          {film.title}
                        </h3>
                        {film.rating && (
                          <div className="flex items-center gap-1 mt-1">
                            {renderStars(film.rating)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Regular Films Section */}
          {regularFilms.length > 0 && (
            <div>
              {featuredFilms.length > 0 && (
                <h3 className="text-lg text-gray-500 font-light mb-8 text-center tracking-wide">
                  All
                </h3>
              )}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {regularFilms.map((film) => (
                  <div
                    key={film.id}
                    className="group cursor-pointer"
                    onClick={() => openModal(film)}
                  >
                    <div className="relative rounded-lg overflow-hidden hover:opacity-90 transition-opacity">
                      {film.cover_image_url ? (
                        <div className="relative w-full aspect-[2/3]">
                          <Image
                            src={film.cover_image_url}
                            alt={film.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      ) : (
                        <div className="w-full aspect-[2/3] bg-gray-900 flex items-center justify-center">
                          <span className="text-gray-600 text-5xl">🎬</span>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                        <h3 className="text-sm font-medium text-white line-clamp-2">
                          {film.title}
                        </h3>
                        {film.rating && (
                          <div className="flex items-center gap-1 mt-1">
                            {renderStars(film.rating)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {featuredFilms.length === 0 && regularFilms.length === 0 && (
            <div className="text-center text-gray-400 mt-20">
              <p className="text-xl">No films or series added yet.</p>
            </div>
          )}
        </div>
        <FooterHero />
        <Navigate themeColor="#8b0000" />
      </main>
      <Footer themeColor="#f08080" />

      {/* Modal */}
      {selectedFilm && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 overflow-y-auto"
          onClick={closeModal}
        >
          <div
            className="bg-[#1a0508] max-w-4xl w-full my-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 text-gray-500 hover:text-white text-3xl z-10 leading-none"
            >
              ×
            </button>

            <div className="flex flex-col md:flex-row gap-8 p-8">
              {/* Cover Image */}
              <div className="shrink-0">
                {selectedFilm.cover_image_url ? (
                  <div className="relative w-full md:w-64 aspect-[2/3] overflow-hidden">
                    <Image
                      src={selectedFilm.cover_image_url}
                      alt={selectedFilm.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 256px"
                    />
                  </div>
                ) : (
                  <div className="w-full md:w-64 aspect-[2/3] bg-gray-900 flex items-center justify-center">
                    <span className="text-gray-600 text-6xl">🎬</span>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 text-white">
                <h2 className="text-2xl font-light mb-6 tracking-wide">
                  {selectedFilm.title}
                </h2>

                {/* Rating */}
                {selectedFilm.rating && (
                  <div className="mb-8">
                    <div className="flex items-center gap-2">
                      {renderStars(selectedFilm.rating)}
                    </div>
                  </div>
                )}

                {/* Metadata */}
                <div className="space-y-3 mb-8 text-sm">
                  {selectedFilm.release_year && (
                    <div className="flex gap-3">
                      <span className="text-gray-500 w-20">Year</span>
                      <span className="text-gray-300">{selectedFilm.release_year}</span>
                    </div>
                  )}
                  {selectedFilm.genre && (
                    <div className="flex gap-3">
                      <span className="text-gray-500 w-20">Genre</span>
                      <span className="text-gray-300">{selectedFilm.genre}</span>
                    </div>
                  )}
                  {selectedFilm.director && (
                    <div className="flex gap-3">
                      <span className="text-gray-500 w-20">Director</span>
                      <span className="text-gray-300">{selectedFilm.director}</span>
                    </div>
                  )}
                  {selectedFilm.duration && (
                    <div className="flex gap-3">
                      <span className="text-gray-500 w-20">Runtime</span>
                      <span className="text-gray-300">{selectedFilm.duration}</span>
                    </div>
                  )}
                  {selectedFilm.type === "series" &&
                    selectedFilm.episode_count && (
                      <div className="flex gap-3">
                        <span className="text-gray-500 w-20">Episodes</span>
                        <span className="text-gray-300">
                          {selectedFilm.episode_count}
                        </span>
                      </div>
                    )}
                </div>

                {/* Review */}
                {selectedFilm.review && (
                  <div className="mb-8">
                    <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap">
                      {selectedFilm.review}
                    </p>
                  </div>
                )}

                {/* View Individual Page Link */}
                <Link
                  href={`/watch/${selectedFilm.id}`}
                  className="inline-block text-sm text-gray-400 hover:text-white transition-colors underline underline-offset-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    document.body.style.overflow = "unset";
                  }}
                >
                  View full page →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
