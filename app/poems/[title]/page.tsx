import path from "path";
import fs from "fs";
import { Metadata } from "next";
import MarkdownViewer from "../../../components/utils/MarkdownViewer";
import Header from "../../../components/Header";
import Navigate from "../../../components/Navigate";
import Footer from "../../../components/Footer";

type PoemPageProps = {
  params: Promise<{
    title: string;
  }>;
};

export async function generateStaticParams() {
  const poemsDir = path.join(process.cwd(), "public", "poems");
  const filenames = fs.readdirSync(poemsDir);

  return filenames.map((filename) => ({
    title: filename.replace(/\.md$/, ""),
  }));
}

export async function generateMetadata({
  params,
}: PoemPageProps): Promise<Metadata> {
  const { title } = await params;
  const titleCapitalised = title.split("-").join(" ");

  return {
    title: `${titleCapitalised} - poems`,
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
}

async function getPoemContent(title: string) {
  const filePath = path.join(process.cwd(), "public", "poems", `${title}.md`);
  const markdownContent = fs.readFileSync(filePath, "utf-8");
  return markdownContent;
}

export default async function PoemPage({ params }: PoemPageProps) {
  const { title } = await params;
  const markdownContent = await getPoemContent(title);

  return (
    <div className={"w-full md:w-[80%] mx-auto px-4"}>
      <Header customHeaderText="poems" />
      <Navigate underPage />
      <MarkdownViewer markdownContent={markdownContent} />
      <Footer />
    </div>
  );
}
