import Footer from "../components/Footer";
import Navigate from "../components/Navigate";
import FooterHero from "../components/FooterHero";
import FeaturedProjects from "../components/FeaturedProjects";
import HomeClient from "../components/HomeClient";
import ThemeWrapper from "../components/ThemeWrapper";

export default async function Home() {
  const homeThemeColor = "rgb(96 165 250)"; // blue-400 - developer mode

  return (
    <ThemeWrapper themeColor={homeThemeColor}>
      <HomeClient>
        <FeaturedProjects />
        <FooterHero />
        <Navigate />
        <Footer />
      </HomeClient>
    </ThemeWrapper>
  );
}
