import { Metadata } from "next";
import Header from "../../components/Header";
import Navigate from "../../components/Navigate";
import Footer from "../../components/Footer";
import Links from "../../components/links/links";
import FooterHero from "@/components/FooterHero";

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

export default function LinksPage() {
  const linksThemeColor = "rgb(253 224 71)"; // yellow-300

  return (
    <div className="w-full px-4 bg-[#1a1508] min-h-screen">
      <Header compact themeColor={linksThemeColor} />
      <Links />
      <FooterHero themeColor={linksThemeColor} />
      <Navigate themeColor={linksThemeColor} />
      <Footer themeColor={linksThemeColor} />
    </div>
  );
}
