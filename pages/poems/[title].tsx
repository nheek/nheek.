import path from "path";
import fs from "fs";
import { GetStaticProps, GetStaticPaths } from "next";
import MarkdownViewer from "../../components/utils/MarkdownViewer";
import Header from "../../components/Header";
import Navigate from "../../components/Navigate";
import Footer from "../../components/Footer";
import Head from "next/head";

type TermsPageProps = {
  markdownContent: string;
  title: string;
};

const TermsPage: React.FC<TermsPageProps> = ({ markdownContent, title }) => {
  return (
    <>
      <Head>
        <title>{title + " - poems"}</title>
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
      <div className={"w-full md:w-[80%] mx-auto px-4"}>
        <Header customHeaderText="poems" />
        <Navigate underPage />
        <MarkdownViewer markdownContent={markdownContent} />
        <Footer />
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const poemsDir = path.join(process.cwd(), "public", "poems");
  const filenames = fs.readdirSync(poemsDir);

  const paths = filenames.map((filename) => {
    const title = filename.replace(/\.md$/, "");
    return {
      params: { title },
    };
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { title } = context.params!;
  const filePath = path.join(process.cwd(), "public", "poems", `${title}.md`);

  const markdownContent = fs.readFileSync(filePath, "utf-8");
  const titleCapitalised = title.toString().split("-").join(" ");

  return {
    props: {
      markdownContent,
      title: titleCapitalised,
    },
  };
};

export default TermsPage;
