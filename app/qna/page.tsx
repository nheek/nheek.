import { Metadata } from "next";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Navigate from "../../components/Navigate";
import FooterHero from "@/components/FooterHero";
import QnAClient from "./QnAClient";
import { getDb } from "@/lib/db";
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
  try {
    const db = getDb();
    const questions = db
      .prepare(
        "SELECT id, question, answer, asker_name, created_at, answered_at FROM qna WHERE status = 'answered' ORDER BY answered_at DESC",
      )
      .all() as QnA[];
    return questions;
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
