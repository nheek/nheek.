import Head from "next/head";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Navigate from "../../components/Navigate";
import Link from "next/link";
import isOdd from "../../components/utils/isOdd";

export default function Poems({
  poems,
}: {
  poems: { title: string; slug: string }[];
}) {
  return (
    <>
      <Head>
        <title>{"poems"}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Links of websites, services, or just anything that I want to showcase"
        />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            "poems",
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={"poems"} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <div className={"w-full md:w-[80%] min-h-screen mx-auto px-4"}>
        <Header customHeaderText={"poems"} />
        <Navigate underPage={true} />
        <Main poems={poems} />
        <Footer />
      </div>
    </>
  );
}

export function Main({ poems }: { poems: { title: string; slug: string }[] }) {
  return (
    <main className="flex justify-center text-2xl">
      <ul className="flex flex-col md:flex-row flex-wrap justify-center gap-6">
        {poems.map((poem, index) => (
          <li
            key={poem.slug}
            className={`${isOdd(index) ? "border-r-4 text-right" : "border-l-4"} md:w-[45%] border-gray-300 border-opacity-50 px-4 py-2 !no-underline`}
          >
            <Link href={`/poems/${poem.slug}`}>{poem.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

import fs from "fs";
import path from "path";

export async function getStaticProps() {
  const poemsDir = path.join(process.cwd(), "public", "poems");
  const filenames = fs.readdirSync(poemsDir);

  const poems = filenames.map((filename) => {
    const slug = filename.replace(/\.md$/, "");
    const title = slug.split("-").join(" ");

    return { slug, title };
  });

  return {
    props: {
      poems,
    },
  };
}
