import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Navigate from "../components/Navigate";
import FooterHero from "../components/FooterHero";
import FeaturedProjects from "../components/FeaturedProjects";

export default function Home() {
  return (
    <>
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
