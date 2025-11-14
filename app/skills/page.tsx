import CustomCursor from "@/components/CustomCursor";
import FooterHero from "@/components/FooterHero";
import Navigate from "@/components/Navigate";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ThemeWrapper from "@/components/ThemeWrapper";
import SkillsPageClient from "./SkillsPageClient";

async function getSkills() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  try {
    const response = await fetch(`${baseUrl}/api/skills`, {
      next: { tags: ["skills"] },
    });
    if (!response.ok) {
      console.error("Failed to fetch skills:", response.statusText);
      return [];
    }
    const data = await response.json();
    return data.skills || [];
  } catch (error) {
    console.error("Error fetching skills:", error);
    return [];
  }
}

export default async function SkillsPage() {
  const skills = await getSkills();
  const themeColor = "#B8E8D8";

  return (
    <ThemeWrapper themeColor={themeColor}>
      <div className="min-h-screen bg-[#1A2E1A] text-white">
        <CustomCursor />
        <SkillsPageClient skills={skills} themeColor={themeColor} />
        <FooterHero themeColor={themeColor} />
        <Navigate themeColor={themeColor} />
        <Footer themeColor={themeColor} />
      </div>
    </ThemeWrapper>
  );
}
