import { Metadata } from "next";
import SongView from "./SongView";

type Props = {
  params: Promise<{ album: string; song: string }>;
};

interface Album {
  id: number;
  codename: string;
  title: string;
  songs: Song[];
}

interface Song {
  id: number;
  codename: string;
  title: string;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { album, song } = await params;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/featured-music/albums.json`,
    );
    const data = await response.json();
    const albumData = data.albums.find((a: Album) => a.codename === album);

    if (albumData) {
      const songData = albumData.songs.find((s: Song) => s.codename === song);
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

export default async function SongPage({ params }: Props) {
  const { album, song } = await params;
  return <SongView albumSlug={album} songSlug={song} />;
}
