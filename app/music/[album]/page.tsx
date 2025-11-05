import { Metadata } from "next";
import AlbumView from "./AlbumView";

type Props = {
  params: Promise<{ album: string }>;
};

interface Album {
  id: number;
  codename: string;
  title: string;
  coverImage: string;
  releaseDate: string;
  songs: any[];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { album } = await params;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/featured-music/albums.json`,
    );
    const data = await response.json();
    const albumData = data.albums.find(
      (a: Album) => a.codename === album,
    );

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

export default async function AlbumPage({ params }: Props) {
  const { album } = await params;
  return <AlbumView albumSlug={album} />;
}
