import { Metadata } from "next";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Navigate from "../../components/Navigate";
import FooterHero from "@/components/FooterHero";
import QnAClient from "./QnAClient";
import ThemeWrapper from "@/components/ThemeWrapper";

export const metadata: Metadata = {
  title: "Q&A",
  description: "Ask me anything! Your questions answered",
  openGraph: {
    title: "Q&A",
    description: "Ask me anything! Your questions answered",
    images: [
      {
        url: `https://og-image.vercel.app/${encodeURI(
          "Q&A",
        )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`,
        width: 1200,
        height: 630,
        alt: "Q&A",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
};

type QnA = {
  id: number;
  question: string;
  answer: string | null;
  asker_name: string | null;
  status: string;
  created_at: string;
  answered_at: string | null;
};

async function getAnsweredQuestions(): Promise<QnA[]> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    const response = await fetch(`${baseUrl}/api/qna?status=answered`, {
      next: { tags: ["qna"] },
    });

    if (!response.ok) {
      console.error("Failed to fetch Q&A:", response.statusText);
      return [];
    }

    const data = await response.json();
    return data.questions || [];
  } catch (error) {
    console.error("Error fetching Q&A:", error);
    return [];
  }
}

export default async function QnAPage() {
  const questions = await getAnsweredQuestions();
  const themeColor = "#075985"; // sky-900 (darker)

  return (
    <ThemeWrapper themeColor={themeColor}>
      <div className="w-full mx-auto min-h-screen h-full bg-[#0c1a2e]">
        <Header compact themeColor={themeColor} />
        <QnAClient initialQuestions={questions} />
        <FooterHero themeColor={themeColor} />
        <Navigate themeColor={themeColor} />
        <Footer themeColor={themeColor} />
      </div>
    </ThemeWrapper>
  );
}
