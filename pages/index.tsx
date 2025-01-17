import Head from "next/head";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Navigate from "../components/Navigate";
import FooterHero from "../components/FooterHero";
import FeaturedProjects from "../components/FeaturedProjects";

export default function Home() {
  return (
    <>
      <Head>
        <title>{"nheek"}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Portfolio website of nheek" />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            "nheek",
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={"nheek"} />
        <meta name="twitter:card" content="summary_large_image" />
        <script
          defer
          src="https://trck.nheek.com/script.js"
          data-website-id="74e002f4-f2a6-43b6-9045-840f9632e53a"
        ></script>
      </Head>
      <main>
        <Hero />
        <FeaturedProjects />
        <FooterHero />
        <Navigate />
      </main>
      <Footer />
    </>
  );
}
