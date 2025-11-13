import CustomCursor from "@/components/CustomCursor";
import FooterHero from "@/components/FooterHero";
import Navigate from "@/components/Navigate";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ThemeWrapper from "@/components/ThemeWrapper";
import SkillsBubblesClientWrapper from "./SkillsBubblesClientWrapper";

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

// Client wrapper for SkillsBubbles
// app/skills/SkillsBubblesClientWrapper.tsx
// "use client";
// import dynamic from "next/dynamic";
// const SkillsBubbles = dynamic(() => import("@/components/skills/SkillsBubbles"));
// export default function SkillsBubblesClientWrapper(props) {
//   return <SkillsBubbles {...props} />;
// }

export default async function SkillsPage() {
  const skills = await getSkills();
  const themeColor = "#B8E8D8";
  return (
    <ThemeWrapper themeColor={themeColor}>
      <div className="min-h-screen bg-[#1A2E1A] text-white">
        <CustomCursor />
        <Header
          compact={true}
          customHeaderText="nheek"
          themeColor={themeColor}
          pageTitle="Skills"
        />
        <main>
          <div className="w-full mx-auto pt-8">
            {/* <h2 className="text-2xl font-bold mb-8 text-center text-[#1e335c] dark:text-navy-300">
              My Skills
            </h2> */}
            {/* Client-side bubble float logic wrapper */}
            <SkillsBubblesClientWrapper skills={skills} />
            {/* <p className="mt-8 text-[#B8E8D8]/50 text-center">
              Click a skill to learn more about how I use it!
            </p> */}
          </div>
        </main>
        <FooterHero themeColor={themeColor} />
        <Navigate themeColor={themeColor} />
        <Footer themeColor={themeColor} />
      </div>
    </ThemeWrapper>
  );
}
