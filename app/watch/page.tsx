import WatchPageClient from "./WatchPageClient";

export const metadata = {
  title: "Watch - nheek",
  description: "Films and series I've watched with ratings and reviews",
};

async function getFilms(): Promise<{
  featured: any[];
  regular: any[];
}> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    const response = await fetch(`${baseUrl}/api/films`, {
      next: { tags: ["films"] },
    });

    if (!response.ok) {
      console.error("Failed to fetch films:", response.statusText);
      return { featured: [], regular: [] };
    }

    const data = await response.json();
    const allFilms = data.films || [];

    // Separate featured and regular films
    const featured = allFilms.filter((film: any) => film.featured === 1);
    const regular = allFilms.filter((film: any) => film.featured === 0);

    return { featured, regular };
  } catch (error) {
    console.error("Error fetching films:", error);
    return { featured: [], regular: [] };
  }
}

export default async function WatchPage() {
  const { featured, regular } = await getFilms();

  return <WatchPageClient featuredFilms={featured} regularFilms={regular} />;
}
