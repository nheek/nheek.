"use client";

import { useEffect } from "react";
import Link from "next/link";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import FooterHero from "../../../../components/FooterHero";
import Navigate from "../../../../components/Navigate";

interface CustomLink {
  name: string;
  url: string;
  color?: string;
}

interface Song {
  id: number;
  codename: string;
  title: string;
  duration: string;
  lyrics?: string;
  streamingLinks?: {
    spotify?: string;
    appleMusic?: string;
    youtube?: string;
  };
  customLinks?: CustomLink[];
}

interface Album {
  id: number;
  codename: string;
  title: string;
  coverImage: string;
  releaseDate: string;
  songs: Song[];
  streamingLinks?: {
    spotify?: string;
    appleMusic?: string;
    youtube?: string;
  };
  customLinks?: CustomLink[];
}

interface SongViewProps {
  album: Album | null;
  song: Song | null;
}

export default function SongView({ album, song }: SongViewProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!album) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#2d0a1f" }}
      >
        <div className="text-center">
          <div className="text-white text-xl mb-4">Album not found</div>
          <Link href="/" className="text-[#c45a74] hover:text-[#d67088]">
            Back to Albums
          </Link>
        </div>
      </div>
    );
  }

  if (!song) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#2d0a1f" }}
      >
        <div className="text-center">
          <div className="text-white text-xl mb-4">Song not found</div>
          <Link
            href={`/music/${album.codename}`}
            className="text-[#c45a74] hover:text-[#d67088]"
          >
            Back to {album.title}
          </Link>
        </div>
      </div>
    );
  }

  const currentSongIndex = album.songs.findIndex(
    (s) => s.codename === song.codename,
  );
  const prevSong =
    currentSongIndex > 0 ? album.songs[currentSongIndex - 1] : null;
  const nextSong =
    currentSongIndex < album.songs.length - 1
      ? album.songs[currentSongIndex + 1]
      : null;

  return (
    <div className="min-h-screen bg-[#2d0a1f]">
      <Header compact={true} themeColor="#c45a74" />

      {/* Main Content */}
      <main>
        <div className="max-w-4xl mx-auto p-4">
          {/* Back to Album Button */}
          <Link
            href={`/music/${album.codename}`}
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
            Back to {album.title}
          </Link>

          {/* Album Cover and Song Info */}
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <img
              src={album.coverImage}
              alt={album.title}
              className="w-full md:w-64 h-64 object-cover rounded-lg"
            />
            <div className="flex flex-col justify-center">
              <p className="text-white/50 text-sm mb-2">From {album.title}</p>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {song.title}
              </h1>
              <p className="text-white/70 mb-4">Duration: {song.duration}</p>

              {/* Custom Links (Song) */}
              {song.customLinks && song.customLinks.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-4">
                  {song.customLinks.map((link: CustomLink, index: number) => (
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
                  ))}
                </div>
              )}

              {/* Streaming Links (Deprecated - fallback for old format) */}
              {song.streamingLinks && !song.customLinks?.length && (
                <div className="flex gap-4 mb-4">
                  {song.streamingLinks.spotify && (
                    <a
                      href={song.streamingLinks.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      <span className="text-sm">Spotify</span>
                    </a>
                  )}
                  {song.streamingLinks.appleMusic && (
                    <a
                      href={song.streamingLinks.appleMusic}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      <span className="text-sm">Apple Music</span>
                    </a>
                  )}
                  {song.streamingLinks.youtube && (
                    <a
                      href={song.streamingLinks.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      <span className="text-sm">YouTube</span>
                    </a>
                  )}
                </div>
              )}

              {/* Album Custom Links if no song-specific custom links */}
              {!song.customLinks?.length &&
                album.customLinks &&
                album.customLinks.length > 0 && (
                  <div className="flex flex-wrap gap-3 mb-4">
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
                          {link.name} (Album)
                        </a>
                      ),
                    )}
                  </div>
                )}

              {/* Album Streaming Links if no song-specific links (Deprecated - fallback) */}
              {!song.streamingLinks &&
                !song.customLinks?.length &&
                !album.customLinks?.length &&
                album.streamingLinks && (
                  <div className="flex gap-4 mb-4">
                    {album.streamingLinks.spotify && (
                      <a
                        href={album.streamingLinks.spotify}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/70 hover:text-white transition-colors"
                      >
                        <span className="text-sm">Spotify (Album)</span>
                      </a>
                    )}
                    {album.streamingLinks.appleMusic && (
                      <a
                        href={album.streamingLinks.appleMusic}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/70 hover:text-white transition-colors"
                      >
                        <span className="text-sm">Apple Music (Album)</span>
                      </a>
                    )}
                    {album.streamingLinks.youtube && (
                      <a
                        href={album.streamingLinks.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/70 hover:text-white transition-colors"
                      >
                        <span className="text-sm">YouTube (Album)</span>
                      </a>
                    )}
                  </div>
                )}
            </div>
          </div>

          {/* Lyrics */}
          <div className="bg-white/5 rounded-lg px-3 py-4">
            <h2 className="text-2xl font-bold text-white mb-6">Lyrics</h2>
            {song.lyrics ? (
              <pre className="text-white/80 whitespace-pre-wrap font-sans leading-relaxed text-lg md:text-xl">
                {song.lyrics}
              </pre>
            ) : (
              <p className="text-white/50 italic">
                Lyrics not available for this song.
              </p>
            )}
          </div>

          {/* Song Navigation */}
          <div className="flex justify-between items-center mt-12 pt-8 border-t border-white/10">
            {prevSong ? (
              <Link
                href={`/music/${album.codename}/${prevSong.codename}`}
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
                  <p className="text-xs text-white/50">Previous Song</p>
                  <p className="text-sm font-medium group-hover:text-[#c45a74]">
                    {prevSong.title}
                  </p>
                </div>
              </Link>
            ) : (
              <div></div>
            )}

            {nextSong ? (
              <Link
                href={`/music/${album.codename}/${nextSong.codename}`}
                className="flex items-center gap-3 text-white/70 hover:text-white transition-colors group"
              >
                <div className="text-right">
                  <p className="text-xs text-white/50">Next Song</p>
                  <p className="text-sm font-medium group-hover:text-[#c45a74]">
                    {nextSong.title}
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
        <FooterHero />
        <Navigate themeColor="#8a3952" />
      </main>
      <Footer themeColor="#c45a74" />
    </div>
  );
}
