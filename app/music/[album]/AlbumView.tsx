"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Footer from "../../../components/Footer";
import FooterHero from "../../../components/FooterHero";
import Navigate from "../../../components/Navigate";

type StreamingLinks = {
  spotify?: string;
  appleMusic?: string;
  youtube?: string;
};

type Song = {
  id: number;
  codename: string;
  title: string;
  duration: string;
  lyrics?: string;
  links?: StreamingLinks;
};

type Album = {
  id: number;
  codename: string;
  title: string;
  coverImage: string;
  releaseDate: string;
  songs: Song[];
  links?: StreamingLinks;
};

type AlbumViewProps = {
  albumSlug: string;
};

export default function AlbumView({ albumSlug }: AlbumViewProps) {
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const fetchAlbum = async () => {
      try {
        const response = await fetch("/featured-music/albums.json");
        const data = await response.json();
        const foundAlbum = data.albums.find(
          (a: Album) => a.codename === albumSlug,
        );

        if (foundAlbum) {
          setAlbum(foundAlbum);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching album:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchAlbum();
  }, [albumSlug, router]);

  if (loading || !album) {
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
          <Link
            href="/"
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
          <div className="rounded-lg shadow-lg">
            <div className="flex flex-col md:flex-row gap-8 mb-8">
              <img
                src={album.coverImage}
                alt={album.title}
                className="w-full md:w-64 h-64 object-cover rounded-lg shadow-md"
              />
              <div className="flex flex-col justify-center">
              <h2 className="text-5xl font-bold mb-2 text-white">
                {album.title}
              </h2>
              <p className="text-gray-400 text-xl mb-3">
                Released: {album.releaseDate}
              </p>
              <p className="text-gray-400 text-lg mb-4">
                {album.songs.length} tracks
              </p>

              {album.links && (
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
          <h3 className="text-2xl font-semibold mb-4 text-white">Tracklist</h3>
          <div className="space-y-2">
            {album.songs.map((song, index) => {
              return (
                <Link
                  key={song.id}
                  href={`/music/${album.codename}/${song.codename}`}
                  className="w-full flex items-center justify-between p-4 hover:bg-[#3a3a3a] rounded-lg transition-colors text-left group"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-gray-500 font-mono w-8">
                      {(index + 1).toString().padStart(2, "0")}
                    </span>
                    <span className="font-medium text-gray-200 group-hover:text-purple-400">
                      {song.title}
                    </span>
                  </div>
                  <span className="text-gray-500">{song.duration}</span>
                </Link>
              );
            })}
          </div>
        </div>
        </div>
        <FooterHero />
        <Navigate />
      </main>
      <Footer />
    </div>
  );
}
