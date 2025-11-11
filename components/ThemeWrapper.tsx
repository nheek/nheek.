"use client";

import { useEffect } from "react";

export default function ThemeWrapper({
  children,
  themeColor,
}: {
  children: React.ReactNode;
  themeColor: string;
}) {
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--cursor-glow-color",
      themeColor,
    );

    return () => {
      document.documentElement.style.removeProperty("--cursor-glow-color");
    };
  }, [themeColor]);

  return <>{children}</>;
}
