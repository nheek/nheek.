"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Album = {
  id: number;
  codename: string;
  title: string;
  coverImage: string;
  releaseDate: string;
  songs: { id: number; codename: string; title: string; duration: string }[];
};

export default function FeaturedMusic() {
  const [albums, setAlbums] = useState<Album[]>([]);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await fetch("/featured-music/albums.json");
        const data = await response.json();
        setAlbums(data.albums || []);
      } catch (error) {
        console.error("Error fetching albums:", error);
        setAlbums([]);
      }
    };
    fetchAlbums();
  }, []);

  return (
    <div className="w-[85%] mx-auto mt-6 mb-20">
      <h2 className="text-2xl md:text-[3rem] xl:text-[4rem] text-center mt-40 mb-8">
        featured music
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {albums.map((album) => {
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
      <div className="text-center mt-10">
        <p className="text-gray-400">
          Click on an album to view the tracklist and lyrics
        </p>
      </div>
    </div>
  );
}
