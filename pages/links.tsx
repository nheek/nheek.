import Head from "next/head";
import Header from "../components/Header";
import Navigate from "../components/Navigate";
// import Main from "../components/Links/Main";
import Footer from "../components/Footer";
import Links from "../components/links/links";

export default function LinksIndex() {
  return (
    <>
      <Head>
        <title>{"links"}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Links of websites, services, or just anything that I want to showcase"
        />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            "links",
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={"links"} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <div className={"w-full md:w-[80%] mx-auto px-4"}>
        <Header customHeaderText={"links"} />
        <Navigate underPage={true} />
        <Links />
        <Footer />
      </div>
    </>
  );
}
