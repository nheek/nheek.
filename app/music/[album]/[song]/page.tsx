import { Metadata } from "next";
import SongView from "./SongView";

type Props = {
  params: Promise<{ album: string; song: string }>;
};

interface CustomLink {
  name: string;
  url: string;
  color?: string;
}

interface StreamingLinks {
  spotify?: string;
  appleMusic?: string;
  youtube?: string;
}

interface Song {
  id: number;
  codename: string;
  title: string;
  duration: string;
  lyrics?: string;
  streamingLinks?: StreamingLinks;
  customLinks?: CustomLink[];
}

interface Album {
  id: number;
  codename: string;
  title: string;
  coverImage: string;
  releaseDate: string;
  songs: Song[];
  streamingLinks?: StreamingLinks;
  customLinks?: CustomLink[];
}

interface ApiSong {
  id: number;
  codename: string;
  title: string;
  duration: string;
  lyrics?: string;
  spotify_link?: string;
  apple_music_link?: string;
  custom_links?: string;
}

interface ApiAlbum {
  id: number;
  codename: string;
  title: string;
  cover_image_url: string;
  release_date: string;
  songs: ApiSong[];
  spotify_link?: string;
  apple_music_link?: string;
  custom_links?: string;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { album: albumSlug, song: songSlug } = await params;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/albums`, {
      cache: "no-store",
    });
    const data = await response.json();
    const albumData = data.albums.find(
      (a: ApiAlbum) => a.codename === albumSlug,
    );

    if (albumData) {
      const songData = albumData.songs.find(
        (s: ApiSong) => s.codename === songSlug,
      );
      if (songData) {
        return {
          title: `${songData.title} - ${albumData.title} - nheek`,
          description: `Listen to ${songData.title} from the album ${albumData.title} by nheek.`,
        };
      }
    }
  } catch (error) {
    console.error("Error fetching song metadata:", error);
  }

  return {
    title: "Song - nheek",
    description: "Listen to music by nheek",
  };
}

async function getSongData(
  albumSlug: string,
  songSlug: string,
): Promise<{ album: Album | null; song: Song | null }> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    const response = await fetch(`${baseUrl}/api/albums`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return { album: null, song: null };
    }

    const data = await response.json();
    const apiAlbums: ApiAlbum[] = data.albums || [];

    // Transform API data to match component format
    const transformedAlbums = apiAlbums.map((album: ApiAlbum) => ({
      id: album.id,
      codename: album.codename,
      title: album.title,
      coverImage: album.cover_image_url || "",
      releaseDate: album.release_date,
      songs: (album.songs || []).map((song: ApiSong) => ({
        id: song.id,
        codename: song.codename,
        title: song.title,
        duration: song.duration,
        lyrics: song.lyrics,
        streamingLinks: {
          spotify: song.spotify_link,
          appleMusic: song.apple_music_link,
        },
        customLinks: song.custom_links ? JSON.parse(song.custom_links) : [],
      })),
      streamingLinks: {
        spotify: album.spotify_link,
        appleMusic: album.apple_music_link,
      },
      customLinks: album.custom_links ? JSON.parse(album.custom_links) : [],
    }));

    const foundAlbum = transformedAlbums.find(
      (a: Album) => a.codename === albumSlug,
    );

    if (!foundAlbum) {
      return { album: null, song: null };
    }

    const foundSong = foundAlbum.songs.find((s) => s.codename === songSlug);

    return { album: foundAlbum, song: foundSong || null };
  } catch (error) {
    console.error("Error fetching song:", error);
    return { album: null, song: null };
  }
}

export default async function SongPage({ params }: Props) {
  const { album: albumSlug, song: songSlug } = await params;
  const { album, song } = await getSongData(albumSlug, songSlug);

  return <SongView album={album} song={song} />;
}
