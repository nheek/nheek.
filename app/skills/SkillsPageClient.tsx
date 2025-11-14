"use client";
import { useState, useRef, useEffect } from "react";
import Header from "@/components/Header";
import SkillsBubblesClientWrapper from "./SkillsBubblesClientWrapper";

interface SkillsPageClientProps {
  skills: Array<{ id: number; name: string; description?: string }>;
  themeColor: string;
}

export default function SkillsPageClient({
  skills,
  themeColor,
}: SkillsPageClientProps) {
  const [faceHidden, setFaceHidden] = useState(false);
  const [isFalling, setIsFalling] = useState(false);
  const [faceInPhysics, setFaceInPhysics] = useState(false);
  const faceRef = useRef<HTMLDivElement>(null);

  const handleFaceClick = () => {
    if (faceRef.current) {
      setIsFalling(true);
      // Start the falling animation
      const faceElement = faceRef.current;
      const rect = faceElement.getBoundingClientRect();
      const startX = rect.left;
      const startY = rect.top;

      // Make it absolute positioned and start falling
      faceElement.style.position = "fixed";
      faceElement.style.left = `${startX}px`;
      faceElement.style.top = `${startY}px`;
      faceElement.style.zIndex = "1000";
      faceElement.style.transition =
        "all 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)";

      // Calculate target position (middle of bubble area)
      const targetX = window.innerWidth / 2 - 40;
      const targetY = 300; // Middle of bubble area

      // Trigger the animation
      setTimeout(() => {
        faceElement.style.left = `${targetX}px`;
        faceElement.style.top = `${targetY}px`;
        faceElement.style.transform = "rotate(360deg)";
      }, 10);

      // After animation completes, start physics control
      setTimeout(() => {
        setFaceInPhysics(true);
        setIsFalling(false);
      }, 1500);
    }
  };

  return (
    <>
      <Header
        compact={true}
        customHeaderText="nheek"
        themeColor={themeColor}
        pageTitle="Skills"
        onFaceClick={handleFaceClick}
        faceHidden={faceHidden}
        isFalling={isFalling}
        faceInPhysics={faceInPhysics}
        faceRef={faceRef}
      />
      <main>
        <div className="w-full mx-auto pt-8">
          <SkillsBubblesClientWrapper
            skills={skills}
            faceHidden={faceHidden}
            faceInPhysics={faceInPhysics}
          />
        </div>
      </main>
    </>
  );
}
