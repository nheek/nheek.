"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import FooterHero from "../../../components/FooterHero";
import Navigate from "../../../components/Navigate";

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
};

type FilmViewProps = {
  film: Film;
};

export default function FilmView({ film }: FilmViewProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const renderStars = (rating: number | null) => {
    if (!rating) return null;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={`full-${i}`} className="text-yellow-400 text-3xl">
          ★
        </span>,
      );
    }
    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-yellow-400 text-3xl">
          ½
        </span>,
      );
    }
    // Fill remaining with empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-gray-600 text-3xl">
          ★
        </span>,
      );
    }
    return <div className="flex items-center gap-1">{stars}</div>;
  };

  return (
    <div className="min-h-screen bg-[#3d0814]">
      <Header themeColor="#f08080" compact />

      <main>
        <div className="w-[85%] mx-auto mt-6 mb-20">
          {/* Back Button */}
          <Link
            href="/watch"
            className="inline-flex items-center gap-2 text-[#f08080] hover:text-[#dc143c] transition-colors mt-40 mb-8"
          >
            <span>←</span>
            <span>Back to All Films</span>
          </Link>

          {/* Film Details */}
          <div className="flex flex-col md:flex-row gap-12 py-8">
            {/* Cover Image */}
            <div className="shrink-0">
              {film.cover_image_url ? (
                <div className="relative w-full md:w-80 aspect-[2/3] overflow-hidden">
                  <Image
                    src={film.cover_image_url}
                    alt={film.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 320px"
                    priority
                  />
                </div>
              ) : (
                <div className="w-full md:w-80 aspect-[2/3] bg-gray-900 flex items-center justify-center">
                  <span className="text-gray-600 text-8xl">🎬</span>
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="flex-1 text-white">
              <h1 className="text-3xl md:text-4xl font-light mb-8 tracking-wide">
                {film.title}
              </h1>

              {/* Rating */}
              {film.rating && (
                <div className="mb-10">
                  <div className="flex items-center gap-2">
                    {renderStars(film.rating)}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="space-y-4 mb-10">
                {film.release_year && (
                  <div className="flex gap-6">
                    <span className="text-gray-500 text-sm w-24">Year</span>
                    <span className="text-gray-300">{film.release_year}</span>
                  </div>
                )}
                {film.genre && (
                  <div className="flex gap-6">
                    <span className="text-gray-500 text-sm w-24">Genre</span>
                    <span className="text-gray-300">{film.genre}</span>
                  </div>
                )}
                {film.director && (
                  <div className="flex gap-6">
                    <span className="text-gray-500 text-sm w-24">Director</span>
                    <span className="text-gray-300">{film.director}</span>
                  </div>
                )}
                {film.duration && (
                  <div className="flex gap-6">
                    <span className="text-gray-500 text-sm w-24">Runtime</span>
                    <span className="text-gray-300">{film.duration}</span>
                  </div>
                )}
                {film.type === "series" && film.episode_count && (
                  <div className="flex gap-6">
                    <span className="text-gray-500 text-sm w-24">Episodes</span>
                    <span className="text-gray-300">{film.episode_count}</span>
                  </div>
                )}
                {film.watch_date && (
                  <div className="flex gap-6">
                    <span className="text-gray-500 text-sm w-24">Watched</span>
                    <span className="text-gray-300">
                      {new Date(film.watch_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </div>

              {/* Review Section */}
              {film.review && (
                <div className="border-t border-gray-800 pt-8 mb-8">
                  <p className="text-gray-400 leading-relaxed whitespace-pre-wrap">
                    {film.review}
                  </p>
                </div>
              )}

              {/* Songs Section */}
              {film.songs &&
                (() => {
                  try {
                    const parsedSongs: Song[] = JSON.parse(film.songs);
                    if (parsedSongs.length > 0) {
                      return (
                        <div className="border-t border-gray-800 pt-8">
                          <h3 className="text-gray-500 text-sm mb-4">
                            Songs I Liked
                          </h3>
                          <div className="space-y-2">
                            {parsedSongs.map((song, index) => (
                              <div key={index} className="text-gray-300">
                                •{" "}
                                {song.link ? (
                                  <a
                                    href={song.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-white underline underline-offset-2 transition-colors"
                                  >
                                    {song.title}
                                  </a>
                                ) : (
                                  song.title
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                  } catch {
                    return null;
                  }
                  return null;
                })()}
            </div>
          </div>
        </div>

        <FooterHero />
        <Navigate themeColor="#8b0000" />
      </main>
      <Footer themeColor="#f08080" />
    </div>
  );
}
