"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const fetchSongData = async () => {
      try {
        const response = await fetch("/featured-music/albums.json");
        const data: AlbumsData = await response.json();

        const foundAlbum = data.albums.find((a) => a.codename === albumSlug);

        if (!foundAlbum) {
          router.push("/");
          return;
        }

        const foundSong = foundAlbum.songs.find((s) => s.codename === songSlug);

        if (!foundSong) {
          router.push(`/music/${foundAlbum.codename}`);
          return;
        }

        setAlbum(foundAlbum);
        setSong(foundSong);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching song data:", error);
        router.push("/");
      }
    };

    fetchSongData();
  }, [albumSlug, songSlug, router]);

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

  if (!album || !song) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#1a1625]">
      {/* Header */}
      <div className="w-[85%] mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between pt-20">
          <Link
            href="/"
            className="text-8xl md:text-[12rem] hover:opacity-70 transition-opacity"
            title="name's nick"
          >
            nheek
          </Link>
          <div className="">
            <div className="bg-slate-200 rounded-full">
              <img
                className="w-40 h-40 p-3 rounded-full"
                src="https://flies.nheek.com/uploads/nheek/pfp/pfp.jpg"
                alt="nheek"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col-reverse md:flex-row gap-2 md:gap-0 items-center justify-between mt-10 md:mt-0 px-4">
          <div className="text-center md:text-left">
            <p className="text-3xl font-semibold">songwriter</p>
            <p>my lyrics breathe life into emotions</p>
          </div>
          <div className="flex items-center gap-10">
            <a href="https://github.com/nheek">
              <img src="/social-links/github.svg" alt="github icon" />
            </a>
            <a href="https://www.facebook.com/nick.james.1622">
              <img src="/social-links/facebook.svg" alt="facebook icon" />
            </a>
            <a href="https://github.com/nheek">
              <img src="/social-links/instagram.svg" alt="instagram icon" />
            </a>
            <a href="https://github.com/nheek">
              <img src="/social-links/linkedin.svg" alt="linkedin icon" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main>
        <div className="w-[85%] mx-auto my-20">
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
            className="w-full md:w-64 h-64 object-cover rounded-lg shadow-lg"
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
        <div className="bg-white/5 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Lyrics</h2>
          {song.lyrics ? (
            <pre className="text-white/80 whitespace-pre-wrap font-sans leading-relaxed">
              {song.lyrics}
            </pre>
          ) : (
            <p className="text-white/50 italic">
              Lyrics not available for this song.
            </p>
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
