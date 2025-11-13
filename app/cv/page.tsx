import Header from "../../components/Header";
import Footer from "../../components/Footer";
import FooterHero from "../../components/FooterHero";
import ThemeWrapper from "../../components/ThemeWrapper";
import Navigate from "../../components/Navigate";
import CV, { CVEntry } from "../../components/cv/cv";

export const metadata = {
  title: "CV / Resume",
  description: "Professional CV and work experience of nheek",
};

// SSR fetch
async function fetchCVEntries(): Promise<CVEntry[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  try {
    const response = await fetch(`${baseUrl}/api/cv`, {
      next: { tags: ["cv"] },
    });

    if (!response.ok) {
      console.error("Failed to fetch CV entries:", response.statusText);
      return [];
    }

    const data = await response.json();
    return data.cv || [];
  } catch (error) {
    console.error("Error fetching CV entries:", error);
    return [];
  }
}

export default async function CVPage() {
  // Lightened indigo/navy color for better contrast
  const cvThemeColor = "rgb(90 120 180)"; // even lighter indigo/navy shade
  const entries = await fetchCVEntries();
  return (
    <ThemeWrapper themeColor={cvThemeColor}>
      <div className="w-full px-4 bg-[#1a1a2e] min-h-screen">
        <Header compact themeColor={cvThemeColor} pageTitle="CV / Resume" />
        <CV entries={entries} />
        <FooterHero themeColor={cvThemeColor} />
        <Navigate themeColor={cvThemeColor} />
        <Footer themeColor={cvThemeColor} />
      </div>
    </ThemeWrapper>
  );
}
