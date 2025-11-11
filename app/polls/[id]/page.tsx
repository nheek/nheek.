import { Metadata } from "next";
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
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    const response = await fetch(`${baseUrl}/api/polls/${id}`, {
      next: { tags: ["polls", `poll-${id}`] },
    });

    if (response.ok) {
      const poll = await response.json();

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
  } catch (error) {
    console.error("Error fetching poll for metadata:", error);
  }

  return {
    title: "Poll Not Found",
  };
}

export default async function PollPage({ params }: Props) {
  const { id } = await params;
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const themeColor = "#7e22ce"; // purple-700

  // Fetch the poll from API
  let poll = null;
  try {
    const response = await fetch(`${baseUrl}/api/polls/${id}`, {
      cache: "no-store",
    });

    if (response.ok) {
      poll = await response.json();
    }
  } catch (error) {
    console.error("Error fetching poll:", error);
  }

  if (!poll) {
    notFound();
  }

  return (
    <ThemeWrapper themeColor={themeColor}>
      <div className="w-full mx-auto min-h-screen h-full bg-[#1a0b2e]">
        <Header compact themeColor={themeColor} />
        <PollClient poll={poll} />
        <FooterHero themeColor={themeColor} />
        <Navigate themeColor={themeColor} />
        <Footer themeColor={themeColor} />
      </div>
    </ThemeWrapper>
  );
}
