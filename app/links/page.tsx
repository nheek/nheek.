import { Metadata } from "next";
import Header from "../../components/Header";
import Navigate from "../../components/Navigate";
import Footer from "../../components/Footer";
import Links from "../../components/links/links";
import FooterHero from "@/components/FooterHero";
import ThemeWrapper from "@/components/ThemeWrapper";

export const metadata: Metadata = {
  title: "links",
  description:
    "Links of websites, services, or just anything that I want to showcase",
  openGraph: {
    title: "links",
    description:
      "Links of websites, services, or just anything that I want to showcase",
    images: [
      {
        url: `https://og-image.vercel.app/${encodeURI(
          "links",
        )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`,
        width: 1200,
        height: 630,
        alt: "links",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
};

type Link = {
  id: number;
  name: string;
  url: string;
  desc: string;
  color: string;
  display_order: number;
};

async function getLinks(): Promise<Link[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    const response = await fetch(`${baseUrl}/api/links`, {
      next: { revalidate: false },
    });

    if (!response.ok) {
      console.error("Failed to fetch links:", response.statusText);
      return [];
    }

    const data = await response.json();
    return (data.links || []).sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error("Error fetching links:", error);
    return [];
  }
}

export default async function LinksPage() {
  const links = await getLinks();
  const linksThemeColor = "rgb(253 224 71)"; // yellow-300

  return (
    <ThemeWrapper themeColor={linksThemeColor}>
      <div className="w-full px-4 bg-[#1a1508] min-h-screen">
        <Header compact themeColor={linksThemeColor} pageTitle="Links" />
        <Links initialLinks={links} />
        <FooterHero themeColor={linksThemeColor} />
        <Navigate themeColor={linksThemeColor} />
        <Footer themeColor={linksThemeColor} />
      </div>
    </ThemeWrapper>
  );
}
