import { Metadata } from "next";
import dynamic from "next/dynamic";
import Header from "../../../components/Header";
import Navigate from "../../../components/Navigate";

const Footer = dynamic(() => import("../../../components/Footer"));
const FeaturedSongsHistory = dynamic(
  () =>
    import(
      "../../../components/fun/featured-songs-history/FeaturedSongsHistory"
    ),
);

export const metadata: Metadata = {
  title: "featured songs history",
  description:
    "Random fun things that I want to showcase on my website like my Spotify playlists.",
  openGraph: {
    title: "featured songs history",
    description:
      "Random fun things that I want to showcase on my website like my Spotify playlists.",
    images: [
      {
        url: `https://og-image.vercel.app/${encodeURI(
          "featured songs history",
        )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`,
        width: 1200,
        height: 630,
        alt: "featured songs history",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function FeaturedSongsHistoryPage() {
  return (
    <div className="w-full md:w-[80%] mx-auto px-4 bg-[rgba(24,20,16,1)] min-h-screen">
      <Header customHeaderText={"featured songs history"} />
      <Navigate underPage />
      <FeaturedSongsHistory />
      <Footer />
    </div>
  );
}
