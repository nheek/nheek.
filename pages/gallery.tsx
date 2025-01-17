import Head from "next/head";
import Header from "../components/Header";
import Main from "../components/gallery/main";
import Footer from "../components/Footer";
import Navigate from "../components/Navigate";

export default function Gallery() {
  return (
    <>
      <Head>
        <title>{"gallery"}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Links of websites, services, or just anything that I want to showcase"
        />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            "gallery",
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={"gallery"} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <div className={"w-full md:w-[80%] mx-auto min-h-screen h-full"}>
        <Header customHeaderText={"gallery"} />
        <Navigate underPage />
        <Main />
        <Footer />
      </div>
    </>
  );
}
