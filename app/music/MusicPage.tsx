"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import FooterHero from "../../components/FooterHero";
import Navigate from "../../components/Navigate";

type Album = {
  id: number;
  codename: string;
  title: string;
  featured?: boolean;
  coverImage: string;
  releaseDate: string;
  songs: { id: number; codename: string; title: string; duration: string }[];
};

export default function MusicPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [featuredAlbums, setFeaturedAlbums] = useState<Album[]>([]);
  const [regularAlbums, setRegularAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const fetchAlbums = async () => {
      try {
        const response = await fetch("/featured-music/albums.json");
        const data = await response.json();
        const allAlbums = data.albums || [];

        // Separate featured and regular albums
        const featured = allAlbums.filter((album: Album) => album.featured);
        const regular = allAlbums.filter((album: Album) => !album.featured);

        setAlbums(allAlbums);
        setFeaturedAlbums(featured);
        setRegularAlbums(regular);
      } catch (error) {
        console.error("Error fetching albums:", error);
        setAlbums([]);
        setFeaturedAlbums([]);
        setRegularAlbums([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAlbums();
  }, []);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#1a1625" }}
      >
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1625]">
      <Header currentPage="music" />

      {/* Main Content */}
      <main>
        <div className="w-[85%] mx-auto mt-6 mb-20">

        <h2 className="text-2xl md:text-[3rem] xl:text-[4rem] text-center mt-40 mb-8">
          featured music
        </h2>

          {/* Featured Albums Section */}
          {featuredAlbums.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px bg-purple-500 w-20"></div>
                <h3 className="text-xl md:text-2xl text-purple-400 font-semibold">
                  Featured Albums
                </h3>
                <div className="h-px bg-purple-500 w-20"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredAlbums.map((album) => {
                  return (
                    <Link
                      key={album.id}
                      href={`/music/${album.codename}`}
                      className="group cursor-pointer"
                    >
                      <div className="relative rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all ring-2 ring-purple-500">
                        <div className="absolute top-2 right-2 z-10 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          FEATURED
                        </div>
                        <img
                          src={album.coverImage}
                          alt={album.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute w-full p-4 bottom-0 bg-gradient-to-t from-black to-transparent">
                          <h3 className="text-2xl font-semibold text-white group-hover:text-purple-400 transition-colors">
                            {album.title}
                          </h3>
                          <p className="text-gray-400">{album.releaseDate}</p>
                          <p className="text-sm text-gray-500 absolute right-0 bottom-0 p-4">
                            {album.songs.length} tracks
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Regular Albums Section */}
          {regularAlbums.length > 0 && (
            <div>
              {featuredAlbums.length > 0 && (
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="h-px bg-gray-600 w-20"></div>
                  <h3 className="text-xl md:text-2xl text-gray-400 font-semibold">
                    All Albums
                  </h3>
                  <div className="h-px bg-gray-600 w-20"></div>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularAlbums.map((album) => {
                  return (
                    <Link
                      key={album.id}
                      href={`/music/${album.codename}`}
                      className="group cursor-pointer"
                    >
                      <div className="relative rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all">
                        <img
                          src={album.coverImage}
                          alt={album.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute w-full p-4 bottom-0 bg-gradient-to-t from-black to-transparent">
                          <h3 className="text-2xl font-semibold text-white group-hover:text-purple-400 transition-colors">
                            {album.title}
                          </h3>
                          <p className="text-gray-400">{album.releaseDate}</p>
                          <p className="text-sm text-gray-500 absolute right-0 bottom-0 p-4">
                            {album.songs.length} tracks
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          <div className="text-center mt-10">
            <p className="text-gray-400">
              Click on an album to view the tracklist and lyrics
            </p>
          </div>
        </div>
        <FooterHero />
        <Navigate />
      </main>
      <Footer />
    </div>
  );
}
