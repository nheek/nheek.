import Footer from "../components/Footer";
import Navigate from "../components/Navigate";
import FooterHero from "../components/FooterHero";
import FeaturedProjects from "../components/FeaturedProjects";
import FeaturedMusic from "../components/FeaturedMusic";
import HomeClient from "../components/HomeClient";

export default async function Home() {
  return (
    <HomeClient>
      <FeaturedProjects />
      {/* <FeaturedMusic /> */}
      <FooterHero />
      <Navigate />
      <Footer />
    </HomeClient>
  );
}
