"use client";
import dynamic from "next/dynamic";

const SkillsBubbles = dynamic(
  () => import("@/components/skills/SkillsBubbles"),
);

interface SkillsBubblesClientWrapperProps {
  skills: Array<{ id: number; name: string; description?: string }>;
  faceHidden?: boolean;
  faceInPhysics?: boolean;
}

export default function SkillsBubblesClientWrapper(
  props: SkillsBubblesClientWrapperProps,
) {
  return <SkillsBubbles {...props} />;
}
