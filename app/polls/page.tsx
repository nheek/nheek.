import { Metadata } from "next";
import { getDb } from "@/lib/db";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Navigate from "../../components/Navigate";
import FooterHero from "@/components/FooterHero";
import PollsClient from "./PollsClient";
import ThemeWrapper from "@/components/ThemeWrapper";

export const metadata: Metadata = {
  title: "Polls",
  description: "Vote on community polls and see what others think",
  openGraph: {
    title: "Polls",
    description: "Vote on community polls and see what others think",
    images: [
      {
        url: `https://og-image.vercel.app/${encodeURI(
          "Polls",
        )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`,
        width: 1200,
        height: 630,
        alt: "Polls",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function PollsPage() {
  const db = getDb();
  const themeColor = "#7e22ce"; // purple-700

  // Fetch all polls (both active and ended)
  const allPolls = db
    .prepare("SELECT * FROM polls ORDER BY created_at DESC")
    .all();

  // For each poll, get its options
  const pollsWithOptions = allPolls.map((poll: any) => {
    const options = db
      .prepare(
        "SELECT * FROM poll_options WHERE poll_id = ? ORDER BY display_order",
      )
      .all(poll.id);

    // Calculate total votes
    const totalVotes = options.reduce(
      (sum: number, opt: any) => sum + (opt.vote_count || 0),
      0,
    );

    return {
      ...poll,
      options,
      totalVotes,
    };
  });

  // Separate active and ended polls
  const activePolls = pollsWithOptions.filter((p) => p.status === "active");
  const endedPolls = pollsWithOptions.filter((p) => p.status === "ended");

  return (
    <ThemeWrapper themeColor={themeColor}>
      <div className="w-full mx-auto min-h-screen h-full bg-[#1a0b2e]">
        <Header compact themeColor={themeColor} />
        <PollsClient activePolls={activePolls} endedPolls={endedPolls} />
        <FooterHero themeColor={themeColor} />
        <Navigate themeColor={themeColor} />
        <Footer themeColor={themeColor} />
      </div>
    </ThemeWrapper>
  );
}
