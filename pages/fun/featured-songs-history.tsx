import dynamic from "next/dynamic";
import Head from "next/head";
const Footer = dynamic(() => import("../../components/Footer"));
import Header from "../../components/Header";
import Navigate from "../../components/Navigate";
const FeaturedSongsHistory = dynamic(
  () =>
    import("../../components/fun/featured-songs-history/FeaturedSongsHistory"),
);

export default function FunFeaturedSongs() {
  return (
    <>
      <Head>
        <title>{"featured songs history"}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Random fun things that I want to showcase on my website like my Spotify playlists."
        />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            "featured songs history",
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={"featured songs history"} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <div className="w-full md:w-[80%] mx-auto px-4">
        <Header customHeaderText={"featured songs history"} />
        <Navigate underPage />
        <FeaturedSongsHistory />
        <Footer />
      </div>
    </>
  );
}
