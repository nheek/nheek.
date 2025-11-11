import { Metadata } from "next";
import { getDb } from "@/lib/db";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import Navigate from "../../../components/Navigate";
import FooterHero from "@/components/FooterHero";
import ThemeWrapper from "@/components/ThemeWrapper";
import PollClient from "./PollClient";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const db = getDb();

  const poll = db.prepare("SELECT * FROM polls WHERE id = ?").get(id) as any;

  if (!poll) {
    return {
      title: "Poll Not Found",
    };
  }

  return {
    title: poll.title,
    description: poll.description || `Vote on: ${poll.title}`,
    openGraph: {
      title: poll.title,
      description: poll.description || `Vote on: ${poll.title}`,
      images: [
        {
          url: `https://og-image.vercel.app/${encodeURI(
            poll.title,
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`,
          width: 1200,
          height: 630,
          alt: poll.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

export default async function PollPage({ params }: Props) {
  const { id } = await params;
  const db = getDb();
  const themeColor = "#7e22ce"; // purple-700

  // Fetch the poll
  const poll = db.prepare("SELECT * FROM polls WHERE id = ?").get(id) as any;

  if (!poll) {
    notFound();
  }

  // Fetch poll options
  const options = db
    .prepare(
      "SELECT * FROM poll_options WHERE poll_id = ? ORDER BY display_order",
    )
    .all(id);

  // Calculate total votes
  const totalVotes = options.reduce(
    (sum: number, opt: any) => sum + (opt.vote_count || 0),
    0,
  );

  const pollWithOptions = {
    ...poll,
    options,
    totalVotes,
  };

  return (
    <ThemeWrapper themeColor={themeColor}>
      <div className="w-full mx-auto min-h-screen h-full bg-[#1a0b2e]">
        <Header compact themeColor={themeColor} />
        <PollClient poll={pollWithOptions} />
        <FooterHero themeColor={themeColor} />
        <Navigate themeColor={themeColor} />
        <Footer themeColor={themeColor} />
      </div>
    </ThemeWrapper>
  );
}
