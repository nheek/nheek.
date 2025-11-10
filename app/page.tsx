import Footer from "../components/Footer";
import Navigate from "../components/Navigate";
import FooterHero from "../components/FooterHero";
import FeaturedProjects from "../components/FeaturedProjects";
import HomeClient from "../components/HomeClient";

export default async function Home() {
  return (
    <HomeClient>
      <FeaturedProjects />
      <FooterHero />
      <Navigate />
      <Footer />
    </HomeClient>
  );
}
