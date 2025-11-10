"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import FooterHero from "../../../../components/FooterHero";
import Navigate from "../../../../components/Navigate";

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
}

interface AlbumsData {
  albums: Album[];
}

interface SongViewProps {
  albumSlug: string;
  songSlug: string;
}

export default function SongView({ albumSlug, songSlug }: SongViewProps) {
  const [album, setAlbum] = useState<Album | null>(null);
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const fetchSongData = async () => {
      try {
        const response = await fetch("/api/albums");
        const data = await response.json();
        const apiAlbums = data.albums || [];
        
        // Transform API data to match component format
        const transformedAlbums = apiAlbums.map((album: any) => ({
          id: album.id,
          codename: album.codename,
          title: album.title,
          coverImage: album.cover_image || "",
          releaseDate: album.release_date,
          songs: (album.songs || []).map((song: any) => ({
            id: song.id,
            codename: song.codename,
            title: song.title,
            duration: song.duration,
            lyrics: song.lyrics,
            streamingLinks: {
              spotify: song.spotify_link,
              appleMusic: song.apple_music_link
            }
          })),
          streamingLinks: {
            spotify: album.spotify_link,
            appleMusic: album.apple_music_link
          }
        }));

        const foundAlbum = transformedAlbums.find((a: Album) => a.codename === albumSlug);

        if (!foundAlbum) {
          setLoading(false);
          return;
        }

        const foundSong = foundAlbum.songs.find((s) => s.codename === songSlug);

        if (!foundSong) {
          setAlbum(foundAlbum);
          setLoading(false);
          return;
        }

        setAlbum(foundAlbum);
        setSong(foundSong);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching song data:", error);
        setLoading(false);
      }
    };

    fetchSongData();
  }, [albumSlug, songSlug]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#1a1625" }}
      >
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  if (!album) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#1a1625" }}
      >
        <div className="text-center">
          <div className="text-white text-xl mb-4">Album not found</div>
          <Link href="/" className="text-purple-400 hover:text-purple-300">
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
        style={{ backgroundColor: "#1a1625" }}
      >
        <div className="text-center">
          <div className="text-white text-xl mb-4">Song not found</div>
          <Link
            href={`/music/${album.codename}`}
            className="text-purple-400 hover:text-purple-300"
          >
            Back to {album.title}
          </Link>
        </div>
      </div>
    );
  }

  const currentSongIndex = album.songs.findIndex(
    (s) => s.codename === songSlug,
  );
  const prevSong =
    currentSongIndex > 0 ? album.songs[currentSongIndex - 1] : null;
  const nextSong =
    currentSongIndex < album.songs.length - 1
      ? album.songs[currentSongIndex + 1]
      : null;

  return (
    <div className="min-h-screen bg-[#1a1625]">
      <Header compact={true} />

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

              {/* Streaming Links */}
              {song.streamingLinks && (
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

              {/* Album Streaming Links if no song-specific links */}
              {!song.streamingLinks && album.streamingLinks && (
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
                  <p className="text-sm font-medium group-hover:text-purple-400">
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
                  <p className="text-sm font-medium group-hover:text-purple-400">
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
        <Navigate />
      </main>
      <Footer />
    </div>
  );
}
