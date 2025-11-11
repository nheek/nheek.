import { notFound } from "next/navigation";
import FilmView from "./FilmView";

type Film = {
  id: number;
  title: string;
  type: "film" | "series";
  cover_image_url: string | null;
  rating: number | null;
  review: string | null;
  release_year: number | null;
  genre: string | null;
  director: string | null;
  duration: string | null;
  episode_count: number | null;
  watch_date: string | null;
  songs: string | null;
  featured: number;
  display_order: number | null;
};

async function getFilm(id: string): Promise<Film | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    const response = await fetch(`${baseUrl}/api/films/${id}`, {
      next: { tags: ["films", `film-${id}`] },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.film as Film | null;
  } catch (error) {
    console.error("Error fetching film:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const film = await getFilm(id);

  if (!film) {
    return {
      title: "Film Not Found",
    };
  }

  const description =
    film.review?.substring(0, 160) || `${film.title} - ${film.type}`;

  return {
    title: film.title,
    description,
    openGraph: {
      title: `${film.title} | nheek`,
      description,
      images: film.cover_image_url
        ? [
            {
              url: film.cover_image_url,
              width: 1200,
              height: 1800,
              alt: film.title,
            },
          ]
        : [
            {
              url: "https://flies.nheek.com/uploads/nheek/pfp/pfp",
              width: 1200,
              height: 1200,
              alt: film.title,
            },
          ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: film.title,
      description,
      images: film.cover_image_url
        ? [film.cover_image_url]
        : ["https://flies.nheek.com/uploads/nheek/pfp/pfp"],
    },
  };
}

export default async function FilmPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const film = await getFilm(id);

  if (!film) {
    notFound();
  }

  return <FilmView film={film} />;
}
