import { Metadata } from "next";
import Header from "../../components/Header";
import Navigate from "../../components/Navigate";
import Footer from "../../components/Footer";
import FeaturedSongs from "../../components/fun/FeaturedSongs";

export const metadata: Metadata = {
  title: "fun",
  description:
    "Random fun things that I want to showcase on my website like my Spotify playlists.",
  openGraph: {
    title: "fun",
    description:
      "Random fun things that I want to showcase on my website like my Spotify playlists.",
    images: [
      {
        url: `https://og-image.vercel.app/${encodeURI(
          "fun",
        )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`,
        width: 1200,
        height: 630,
        alt: "fun",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function FunPage() {
  return (
    <div className="w-full md:w-[80%] mx-auto px-4 bg-[rgba(24,20,16,1)] min-h-screen">
      <Header customHeaderText="fun" />
      <Navigate underPage />
      <FeaturedSongs />
      <Footer />
    </div>
  );
}
