"use client";

import { useState } from "react";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Navigate from "../components/Navigate";
import FooterHero from "../components/FooterHero";
import FeaturedProjects from "../components/FeaturedProjects";
import FeaturedMusic from "../components/FeaturedMusic";

export default function Home() {
  const [mode, setMode] = useState<"developer" | "songwriter">("developer");

  return (
    <div
      className={`min-h-screen transition-colors duration-700 ${
        mode === "songwriter" ? "bg-[#1a1625]" : "bg-[rgba(24,20,16,1)]"
      }`}
    >
      <main>
        <Hero mode={mode} onModeChange={setMode} />
        <FeaturedProjects />
        <FooterHero />
        <Navigate />
      </main>
      <Footer />
    </div>
  );
}
