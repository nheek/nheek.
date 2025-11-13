import Header from "../../components/Header";
import Footer from "../../components/Footer";
import FooterHero from "../../components/FooterHero";
import ThemeWrapper from "../../components/ThemeWrapper";
import Navigate from "../../components/Navigate";
import CV from "../../components/cv/cv";

export const metadata = {
  title: "CV / Resume",
  description: "Professional CV and work experience of nheek",
};

export default async function CVPage() {
  // Lightened indigo/navy color for better contrast
  const cvThemeColor = "rgb(90 120 180)"; // even lighter indigo/navy shade
  return (
    <ThemeWrapper themeColor={cvThemeColor}>
      <div className="w-full px-4 bg-[#1a1a2e] min-h-screen">
        <Header compact themeColor={cvThemeColor} pageTitle="CV / Resume" />
        {await CV()}
        <FooterHero themeColor={cvThemeColor} />
        <Navigate themeColor={cvThemeColor} />
        <Footer themeColor={cvThemeColor} />
      </div>
    </ThemeWrapper>
  );
}
