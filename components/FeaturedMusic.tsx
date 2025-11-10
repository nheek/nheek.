import FeaturedMusicClient from "./FeaturedMusicClient";

type Album = {
  id: number;
  codename: string;
  title: string;
  featured?: boolean;
  coverImage: string;
  releaseDate: string;
  songs: { id: number; codename: string; title: string; duration: string }[];
};

interface ApiAlbum {
  id: number;
  codename: string;
  title: string;
  featured: number;
  cover_image_url: string;
  release_date: string;
  songs: { id: number; codename: string; title: string; duration: string }[];
}

async function getAlbums(): Promise<{
  featured: Album[];
  regular: Album[];
}> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    const response = await fetch(`${baseUrl}/api/albums`, {
      next: { tags: ["albums"] }, // Tag for on-demand revalidation
    });

    if (!response.ok) {
      console.error("Failed to fetch albums:", response.statusText);
      return { featured: [], regular: [] };
    }

    const data = await response.json();
    const apiAlbums = data.albums || [];

    // Transform API data to match component format
    const allAlbums = apiAlbums.map((album: ApiAlbum) => ({
      id: album.id,
      codename: album.codename,
      title: album.title,
      featured: album.featured === 1,
      coverImage: album.cover_image_url || "",
      releaseDate: album.release_date,
      songs: album.songs || [],
    }));

    // Sort albums by release date (newest first)
    const sortedAlbums = [...allAlbums].sort((a: Album, b: Album) => {
      const dateA = new Date(a.releaseDate);
      const dateB = new Date(b.releaseDate);
      return dateB.getTime() - dateA.getTime();
    });

    // Separate featured and regular albums
    const featured = sortedAlbums.filter((album: Album) => album.featured);
    const regular = sortedAlbums.filter((album: Album) => !album.featured);

    return { featured, regular };
  } catch (error) {
    console.error("Error fetching albums:", error);
    return { featured: [], regular: [] };
  }
}

export default async function FeaturedMusic() {
  const { featured: featuredAlbums, regular: regularAlbums } =
    await getAlbums();

  return (
    <FeaturedMusicClient
      featuredAlbums={featuredAlbums}
      regularAlbums={regularAlbums}
    />
  );
}
