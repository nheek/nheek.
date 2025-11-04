import { Metadata } from "next";
import Header from "../../components/Header";
import Gallery from "../../components/gallery/gallery";
import Footer from "../../components/Footer";
import Navigate from "../../components/Navigate";

export const metadata: Metadata = {
  title: "gallery",
  description:
    "Links of websites, services, or just anything that I want to showcase",
  openGraph: {
    title: "gallery",
    description:
      "Links of websites, services, or just anything that I want to showcase",
    images: [
      {
        url: `https://og-image.vercel.app/${encodeURI(
          "gallery",
        )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`,
        width: 1200,
        height: 630,
        alt: "gallery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function GalleryPage() {
  return (
    <div className="w-full md:w-[80%] mx-auto min-h-screen h-full bg-[rgba(24,20,16,1)]">
      <Header customHeaderText={"gallery"} />
      <Navigate underPage />
      <Gallery />
      <Footer />
    </div>
  );
}
