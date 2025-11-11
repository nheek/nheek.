import { Metadata } from "next";
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

async function getPolls() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    const response = await fetch(`${baseUrl}/api/polls?includeAll=true`, {
      next: { tags: ["polls"] },
    });

    if (!response.ok) {
      console.error("Failed to fetch polls:", response.statusText);
      return { activePolls: [], endedPolls: [] };
    }

    const allPolls = await response.json();

    // Separate active and ended polls
    const activePolls = allPolls.filter((p: any) => p.status === "active");
    const endedPolls = allPolls.filter((p: any) => p.status === "ended");

    return { activePolls, endedPolls };
  } catch (error) {
    console.error("Error fetching polls:", error);
    return { activePolls: [], endedPolls: [] };
  }
}

export default async function PollsPage() {
  const { activePolls, endedPolls } = await getPolls();
  const themeColor = "#7e22ce"; // purple-700

  return (
    <ThemeWrapper themeColor={themeColor}>
      <div className="w-full mx-auto min-h-screen h-full bg-[#1a0b2e]">
        <Header compact themeColor={themeColor} pageTitle="Polls" />
        <PollsClient activePolls={activePolls} endedPolls={endedPolls} />
        <FooterHero themeColor={themeColor} />
        <Navigate themeColor={themeColor} />
        <Footer themeColor={themeColor} />
      </div>
    </ThemeWrapper>
  );
}
