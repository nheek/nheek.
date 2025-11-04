"use client";

import { useState, useEffect } from "react";

type StreamingLinks = {
  spotify?: string;
  appleMusic?: string;
  youtube?: string;
};

type Song = {
  id: number;
  title: string;
  duration: string;
  lyrics?: string;
  links?: StreamingLinks;
};

type Album = {
  id: number;
  title: string;
  coverImage: string;
  releaseDate: string;
  songs: Song[];
  links?: StreamingLinks;
};

export default function FeaturedMusic() {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
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

  const handleBackToAlbums = () => {
    setSelectedAlbum(null);
    setSelectedSong(null);
  };

  const handleBackToTracklist = () => {
    setSelectedSong(null);
  };

  // View: Lyrics
  if (selectedSong) {
    return (
      <div className="w-[85%] mx-auto my-20">
        <button
          onClick={handleBackToTracklist}
          className="mb-6 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          ← Back to Tracklist
        </button>
        <div className="bg-[#2a2a2a] rounded-lg shadow-lg p-8 border border-gray-700">
          <h2 className="text-4xl font-bold mb-2 text-white">
            {selectedSong.title}
          </h2>
          <p className="text-gray-400 mb-6">
            {selectedAlbum?.title} • {selectedSong.duration}
          </p>

          {selectedSong.links && (
            <div className="flex gap-3 mb-6">
              {selectedSong.links.spotify && (
                <a
                  href={selectedSong.links.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#1DB954] text-white rounded-full text-sm hover:bg-[#1ed760] transition-colors"
                >
                  Spotify
                </a>
              )}
              {selectedSong.links.appleMusic && (
                <a
                  href={selectedSong.links.appleMusic}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#FA243C] text-white rounded-full text-sm hover:bg-[#fc4d63] transition-colors"
                >
                  Apple Music
                </a>
              )}
              {selectedSong.links.youtube && (
                <a
                  href={selectedSong.links.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#FF0000] text-white rounded-full text-sm hover:bg-[#ff3333] transition-colors"
                >
                  YouTube
                </a>
              )}
            </div>
          )}

          <div className="whitespace-pre-line text-lg leading-relaxed text-gray-300">
            {selectedSong.lyrics || "Lyrics not available yet."}
          </div>
        </div>
      </div>
    );
  }

  // View: Tracklist
  if (selectedAlbum) {
    return (
      <div className="w-[85%] mx-auto my-20">
        <button
          onClick={handleBackToAlbums}
          className="mb-6 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          ← Back to Albums
        </button>
        <div className="bg-[#2a2a2a] rounded-lg shadow-lg p-8 border border-gray-700">
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <img
              src={selectedAlbum.coverImage}
              alt={selectedAlbum.title}
              className="w-full md:w-64 h-64 object-cover rounded-lg shadow-md"
            />
            <div className="flex flex-col justify-center">
              <h2 className="text-5xl font-bold mb-2 text-white">
                {selectedAlbum.title}
              </h2>
              <p className="text-gray-400 text-xl mb-3">
                Released: {selectedAlbum.releaseDate}
              </p>
              <p className="text-gray-400 text-lg mb-4">
                {selectedAlbum.songs.length} tracks
              </p>

              {selectedAlbum.links && (
                <div className="flex gap-3 flex-wrap">
                  {selectedAlbum.links.spotify && (
                    <a
                      href={selectedAlbum.links.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-[#1DB954] text-white rounded-full text-sm hover:bg-[#1ed760] transition-colors"
                    >
                      Spotify
                    </a>
                  )}
                  {selectedAlbum.links.appleMusic && (
                    <a
                      href={selectedAlbum.links.appleMusic}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-[#FA243C] text-white rounded-full text-sm hover:bg-[#fc4d63] transition-colors"
                    >
                      Apple Music
                    </a>
                  )}
                  {selectedAlbum.links.youtube && (
                    <a
                      href={selectedAlbum.links.youtube}
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
            {selectedAlbum.songs.map((song, index) => (
              <button
                key={song.id}
                onClick={() => setSelectedSong(song)}
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
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // View: Albums Grid
  return (
    <div className="w-[85%] mx-auto my-20">
      <h2 className="text-2xl md:text-[3rem] xl:text-[4rem] text-center mb-8">
        featured music
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {albums.map((album) => (
          <button
            key={album.id}
            onClick={() => setSelectedAlbum(album)}
            className="group cursor-pointer text-left"
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
          </button>
        ))}
      </div>
      <div className="text-center mt-10">
        <p className="text-gray-400">
          Click on an album to view the tracklist and lyrics
        </p>
      </div>
    </div>
  );
}
