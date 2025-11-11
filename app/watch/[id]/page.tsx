import { notFound } from "next/navigation";
import FilmView from "./FilmView";
import { getDb } from "../../../lib/db";

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
  featured: number;
  display_order: number | null;
};

async function getFilm(id: string): Promise<Film | null> {
  try {
    const db = getDb();
    const film = db.prepare("SELECT * FROM films WHERE id = ?").get(id);
    return film as Film | null;
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

  return {
    title: `${film.title} - Watch`,
    description: film.review || `${film.title} - ${film.type}`,
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
