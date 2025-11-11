import { Metadata } from "next";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Navigate from "../../components/Navigate";
import Link from "next/link";
import fs from "fs";
import path from "path";
import FooterHero from "@/components/FooterHero";

export const metadata: Metadata = {
  title: "poems",
  description:
    "Links of websites, services, or just anything that I want to showcase",
  openGraph: {
    title: "poems",
    description:
      "Links of websites, services, or just anything that I want to showcase",
    images: [
      {
        url: `https://og-image.vercel.app/${encodeURI(
          "poems",
        )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`,
        width: 1200,
        height: 630,
        alt: "poems",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
};

async function getPoems() {
  const poemsDir = path.join(process.cwd(), "public", "poems");
  const filenames = fs.readdirSync(poemsDir);

  const poems = filenames.map((filename) => {
    const slug = filename.replace(/\.md$/, "");
    const title = slug.split("-").join(" ");

    return { slug, title };
  });

  return poems;
}

function Main({ poems }: { poems: { title: string; slug: string }[] }) {
  return (
    <main className="w-full md:w-[70%] lg:w-[60%] xl:w-[50%] mx-auto mt-12 md:mt-20 mb-20">
      {/* Book-style header */}
      <div className="mb-12 pb-8 border-b-2 border-orange-900/30">
        <h2 className="text-3xl md:text-4xl font-serif text-center text-orange-100 mb-2">
          contents
        </h2>
        <div className="flex justify-center gap-2 text-orange-900/50">
          <span className="text-sm">◆</span>
          <span className="text-sm">◆</span>
          <span className="text-sm">◆</span>
        </div>
      </div>

      {/* Table of contents style list */}
      <div className="space-y-1">
        {poems.map((poem, index) => (
          <Link
            key={poem.slug}
            href={`/poems/${poem.slug}`}
            className="group flex items-baseline justify-between py-3 px-2 hover:bg-orange-950/30 transition-colors duration-200 !no-underline"
          >
            <div className="flex items-baseline gap-4">
              <span className="text-sm font-mono text-orange-800/70 group-hover:text-orange-400 transition-colors duration-200 min-w-[2rem]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-lg md:text-xl font-serif text-orange-100 group-hover:text-white transition-colors duration-200">
                {poem.title.toLowerCase()}
              </h3>
            </div>

            <div className="flex items-center gap-3 ml-4 shrink-0">
              <div className="hidden md:block border-b border-dotted border-orange-900/40 flex-1 min-w-[3rem] group-hover:border-orange-600 transition-colors duration-200" />
              <span className="text-sm font-mono text-orange-800/70 group-hover:text-orange-400 transition-colors duration-200">
                →
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Book-style footer */}
      <div className="mt-12 pt-8 border-t-2 border-orange-900/30 text-center">
        <p className="text-sm text-orange-700/60 italic">
          {poems.length} poems
        </p>
      </div>
    </main>
  );
}

export default async function PoemsPage() {
  const poems = await getPoems();

  return (
    <div className="w-full min-h-screen mx-auto px-4 bg-[#140e0a]">
      <Header compact />
      <Main poems={poems} />
      <FooterHero />
      <Navigate />
      <Footer />
    </div>
  );
}
