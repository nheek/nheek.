import Navigate from "@/components/Navigate";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import WallClient from "./WallClient";
import FooterHero from "@/components/FooterHero";

interface Contribution {
  id: number;
  name: string;
  category: string;
  content: string;
  website_url: string | null;
  song_link: string | null;
  show_link: number;
  created_at: string;
}

async function getContributions(): Promise<Contribution[]> {
  // In production, use full URL; in development, use relative URL
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    const response = await fetch(
      `${baseUrl}/api/contributions?status=approved`,
      {
        cache: "no-store", // Always get fresh data
      },
    );

    if (!response.ok) {
      console.error("Failed to fetch contributions:", response.statusText);
      return [];
    }

    const data = await response.json();
    return data.contributions || [];
  } catch (error) {
    console.error("Error fetching contributions:", error);
    return [];
  }
}

export default async function WallPage() {
  const contributions = await getContributions();
  const wallThemeColor = "rgb(134 239 172)"; // green-300

  return (
    <div className="min-h-screen bg-[#0a1410] text-white">
      <Header compact={true} customHeaderText="nheek" themeColor={wallThemeColor} />

      <main>
        <div className="w-[85%] mx-auto pt-8">
          <WallClient initialContributions={contributions} />
        </div>
      </main>

      <FooterHero themeColor={wallThemeColor} />
      <Navigate themeColor={wallThemeColor} />
      <Footer themeColor={wallThemeColor} />
    </div>
  );
}
