import { Metadata } from "next";
import AlbumView from "./AlbumView";

type Props = {
  params: Promise<{ album: string }>;
};

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

interface Song {
  id: number;
  codename: string;
  title: string;
  duration: string;
  lyrics?: string;
  links?: StreamingLinks;
  customLinks?: CustomLink[];
}

interface Album {
  id: number;
  codename: string;
  title: string;
  coverImage: string;
  releaseDate: string;
  songs: Song[];
  links?: StreamingLinks;
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
  const { album } = await params;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/featured-music/albums.json`,
    );
    const data = await response.json();
    const albumData = data.albums.find((a: Album) => a.codename === album);

    if (albumData) {
      return {
        title: `${albumData.title} - nheek`,
        description: `Listen to ${albumData.title} by nheek. ${albumData.songs.length} tracks.`,
      };
    }
  } catch (error) {
    console.error("Error fetching album metadata:", error);
  }

  return {
    title: "Album - nheek",
    description: "Explore music by nheek",
  };
}

async function getAlbumData(albumSlug: string): Promise<{
  album: Album | null;
  allAlbums: Album[];
}> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    const response = await fetch(`${baseUrl}/api/albums`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return { album: null, allAlbums: [] };
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
        links: {
          spotify: song.spotify_link,
          appleMusic: song.apple_music_link,
        },
        customLinks: song.custom_links ? JSON.parse(song.custom_links) : [],
      })),
      links: {
        spotify: album.spotify_link,
        appleMusic: album.apple_music_link,
      },
      customLinks: album.custom_links ? JSON.parse(album.custom_links) : [],
    }));

    const foundAlbum = transformedAlbums.find(
      (a: Album) => a.codename === albumSlug,
    );

    return { album: foundAlbum || null, allAlbums: transformedAlbums };
  } catch (error) {
    console.error("Error fetching album:", error);
    return { album: null, allAlbums: [] };
  }
}

export default async function AlbumPage({ params }: Props) {
  const { album: albumSlug } = await params;
  const { album, allAlbums } = await getAlbumData(albumSlug);

  return (
    <AlbumView albumSlug={albumSlug} album={album} allAlbums={allAlbums} />
  );
}
