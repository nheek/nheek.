"use client";

import { useState } from "react";
import Hero from "./Hero";

interface HomeClientProps {
  children: React.ReactNode;
}

export default function HomeClient({ children }: HomeClientProps) {
  const [mode, setMode] = useState<"developer" | "songwriter">("developer");
  const themeColor = mode === "developer" ? "rgb(96, 165, 250)" : "#c45a74";

  return (
    <div
      className={`min-h-screen transition-colors duration-700 ${
        mode === "songwriter" ? "bg-[#1a1625]" : "bg-[rgba(24,20,16,1)]"
      }`}
    >
      <main>
        <Hero mode={mode} onModeChange={setMode} themeColor={themeColor} />
        {children}
      </main>
    </div>
  );
}
