"use client";

import { useEffect } from "react";
import Link from "next/link";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import FooterHero from "../../../components/FooterHero";
import Navigate from "../../../components/Navigate";

type StreamingLinks = {
  spotify?: string;
  appleMusic?: string;
  youtube?: string;
};

type CustomLink = {
  name: string;
  url: string;
  color?: string;
};

type Song = {
  id: number;
  codename: string;
  title: string;
  duration: string;
  lyrics?: string;
  links?: StreamingLinks;
  customLinks?: CustomLink[];
};

type Album = {
  id: number;
  codename: string;
  title: string;
  coverImage: string;
  releaseDate: string;
  songs: Song[];
  links?: StreamingLinks;
  customLinks?: CustomLink[];
};

type AlbumViewProps = {
  albumSlug: string;
  album: Album | null;
  allAlbums: Album[];
};

export default function AlbumView({
  albumSlug,
  album,
  allAlbums,
}: AlbumViewProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const currentIndex = allAlbums.findIndex((a) => a.codename === albumSlug);
  const prevAlbum = currentIndex > 0 ? allAlbums[currentIndex - 1] : null;
  const nextAlbum =
    currentIndex < allAlbums.length - 1 ? allAlbums[currentIndex + 1] : null;

  if (!album) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#2d0a1f" }}
      >
        <div className="text-center">
          <div className="text-white text-xl mb-4">Album not found</div>
          <Link href="/music" className="text-[#c45a74] hover:text-[#d67088]">
            Back to Albums
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2d0a1f]">
      <Header compact={true} themeColor="#c45a74" />

      {/* Main Content */}
      <main>
        <div className="max-w-4xl mx-auto p-4">
          <Link
            href="/music"
            className="inline-flex items-center text-white/70 hover:text-white mb-8 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Albums
          </Link>
          <div className="rounded-lg">
            <div className="flex flex-col md:flex-row gap-8 mb-8">
              <img
                src={album.coverImage}
                alt={album.title}
                className="w-full md:w-64 h-full md:h-64 object-cover rounded-lg shadow-md"
              />
              <div className="flex flex-col justify-center">
                <h2 className="text-3xl md:text-5xl font-bold mb-2 text-white">
                  {album.title}
                </h2>
                {/* <p className="text-gray-400 text-base md:text-xl mb-3">
                  Released: {album.releaseDate}
                </p> */}
                <p className="text-gray-400 text-sm md:text-lg mb-4">
                  {album.songs.length} tracks
                </p>

                {/* Custom Links */}
                {album.customLinks && album.customLinks.length > 0 && (
                  <div className="flex gap-3 flex-wrap mb-4">
                    {album.customLinks.map(
                      (link: CustomLink, index: number) => (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-white transition-all hover:scale-105"
                          style={{ backgroundColor: link.color || "#6B7280" }}
                        >
                          {link.name}
                        </a>
                      ),
                    )}
                  </div>
                )}

                {/* Old Streaming Links (Fallback) */}
                {!album.customLinks?.length && album.links && (
                  <div className="flex gap-3 flex-wrap">
                    {album.links.spotify && (
                      <a
                        href={album.links.spotify}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-[#1DB954] text-white rounded-full text-sm hover:bg-[#1ed760] transition-colors"
                      >
                        Spotify
                      </a>
                    )}
                    {album.links.appleMusic && (
                      <a
                        href={album.links.appleMusic}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-[#FA243C] text-white rounded-full text-sm hover:bg-[#fc4d63] transition-colors"
                      >
                        Apple Music
                      </a>
                    )}
                    {album.links.youtube && (
                      <a
                        href={album.links.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-[#FF0000] text-white rounded-full text-sm hover:bg-[#ff3333] transition-colors"
                      >
                        YouTube
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
            <h3 className="text-lg md:text-2xl font-semibold mb-4 text-white">
              Tracklist
            </h3>
            <div className="space-y-2">
              {album.songs.map((song, index) => {
                return (
                  <Link
                    key={song.id}
                    href={`/music/${album.codename}/${song.codename}`}
                    className="w-full flex items-center justify-between px-2 md:px-4 py-3 md:py-4 hover:bg-[#4a2538] rounded-lg transition-colors text-left group no-underline!"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-gray-500 font-mono w-8">
                        {(index + 1).toString().padStart(2, "0")}
                      </span>
                      <span className="font-medium text-gray-200 group-hover:text-[#c45a74]">
                        {song.title}
                      </span>
                    </div>
                    <span className="text-gray-500">{song.duration}</span>
                  </Link>
                );
              })}
            </div>

            {/* Album Navigation */}
            <div className="flex justify-between items-center mt-12 pt-8 border-t border-white/10">
              {prevAlbum ? (
                <Link
                  href={`/music/${prevAlbum.codename}`}
                  className="flex items-center gap-3 text-white/70 hover:text-white transition-colors group"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  <div className="text-left">
                    <p className="text-xs text-white/50">Previous Album</p>
                    <p className="text-sm font-medium group-hover:text-[#c45a74]">
                      {prevAlbum.title}
                    </p>
                  </div>
                </Link>
              ) : (
                <div></div>
              )}

              {nextAlbum ? (
                <Link
                  href={`/music/${nextAlbum.codename}`}
                  className="flex items-center gap-3 text-white/70 hover:text-white transition-colors group"
                >
                  <div className="text-right">
                    <p className="text-xs text-white/50">Next Album</p>
                    <p className="text-sm font-medium group-hover:text-[#c45a74]">
                      {nextAlbum.title}
                    </p>
                  </div>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>
        <FooterHero />
        <Navigate themeColor="#8a3952" />
      </main>
      <Footer themeColor="#c45a74" />
    </div>
  );
}
