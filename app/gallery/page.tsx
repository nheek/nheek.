import { Metadata } from "next";
import Header from "../../components/Header";
import Gallery from "../../components/gallery/gallery";
import Footer from "../../components/Footer";
import Navigate from "../../components/Navigate";
import FooterHero from "@/components/FooterHero";
import { getDb } from "@/lib/db";
import ThemeWrapper from "@/components/ThemeWrapper";

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

type GalleryImage = {
  id: number;
  image_url: string;
  alt_text: string;
  display_order: number;
};

async function getGalleryImages(): Promise<GalleryImage[]> {
  try {
    const db = getDb();
    const images = db
      .prepare(
        "SELECT id, image_url, alt_text, display_order FROM gallery_images ORDER BY display_order ASC",
      )
      .all() as GalleryImage[];
    return images;
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    return [];
  }
}

export default async function GalleryPage() {
  const images = await getGalleryImages();
  const galleryThemeColor = "rgb(203 213 225)"; // slate-300

  return (
    <ThemeWrapper themeColor={galleryThemeColor}>
      <div className="w-full mx-auto min-h-screen h-full bg-[#0f1114]">
        <Header compact themeColor={galleryThemeColor} />
        <Gallery initialImages={images} />
        <FooterHero themeColor={galleryThemeColor} />
        <Navigate themeColor={galleryThemeColor} />
        <Footer themeColor={galleryThemeColor} />
      </div>
    </ThemeWrapper>
  );
}
