import Head from "next/head";
import Header from "../../components/Header";
import Navigate from "../../components/Navigate";
import Footer from "../../components/Footer";
import FeaturedSongs from "../../components/fun/FeaturedSongs";

export default function Fun() {
  return (
    <>
      <Head>
        <title>{"fun"}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Random fun things that I want to showcase on my website like my Spotify playlists."
        />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            "fun",
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={"fun"} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <div className={"w-full md:w-[80%] mx-auto px-4"}>
        <Header customHeaderText="fun" />
        <Navigate underPage />
        <FeaturedSongs />
        <Footer />
      </div>
    </>
  );
}
