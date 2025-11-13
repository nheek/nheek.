"use client";
import Link from "next/link";
import React, { useRef, useEffect, useState } from "react";

interface Skill {
  id: number;
  name: string;
  description?: string;
}

export default function SkillsBubbles({ skills }: { skills: Skill[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState(() =>
    skills.map((_, i) => ({
      x: 60 + i * 140,
      y: 250,
      vx: 0,
      vy: 0,
      id: i,
    }))
  );
  const bubbleSize = 96;
  const friction = 0.98;
  const pushStrength = 2;

  // Track mouse position for cursor interaction
  const mouse = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  useEffect(() => {
    let animationFrame: number;
    function animate() {
      setPositions((prev) => {
        // Bubble physics: collision and cursor push
  const next = prev.map((pos) => ({ ...pos }));
        // Bubble-bubble collision
        for (let i = 0; i < next.length; i++) {
          for (let j = i + 1; j < next.length; j++) {
            const a = next[i];
            const b = next[j];
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            // Add a small offset so bubbles bounce before fully touching
            const bounceOffset = 0; // px, tweak for effect
            if (dist < bubbleSize - bounceOffset) {
              const overlap = bubbleSize - bounceOffset - dist;
              const nx = dx / (dist || 1);
              const ny = dy / (dist || 1);
              a.x -= (nx * overlap) / 2;
              a.y -= (ny * overlap) / 2;
              b.x += (nx * overlap) / 2;
              b.y += (ny * overlap) / 2;
              // Simple velocity exchange
              const vax = a.vx;
              const vay = a.vy;
              a.vx = b.vx;
              a.vy = b.vy;
              b.vx = vax;
              b.vy = vay;
            }
          }
        }
        // Bubble movement and wall collision
        for (let i = 0; i < next.length; i++) {
          let { x, y, vx, vy } = next[i];
          x += vx;
          y += vy;
          vx *= friction;
          vy *= friction;
          // Container bounds
          if (containerRef.current) {
            const width = containerRef.current.offsetWidth;
            if (x < 0) {
              x = 0;
              vx = -vx * 0.7;
            }
            if (x > width - bubbleSize) {
              x = width - bubbleSize;
              vx = -vx * 0.7;
            }
          }
          if (y > 250) {
            y = 250;
            vy = -vy * 0.7;
          }
          if (y < 0) {
            y = 0;
            vy = -vy * 0.7;
          }
          // Cursor push
          if (mouse.current.active) {
            const mx = mouse.current.x;
            const my = mouse.current.y;
            const dx = x + bubbleSize / 2 - mx;
            const dy = y + bubbleSize / 2 - my;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < bubbleSize) {
              // Push away from cursor
              const force = (bubbleSize - dist) * 0.2;
              const nx = dx / (dist || 1);
              const ny = dy / (dist || 1);
              vx += nx * force;
              vy += ny * force;
            }
          }
          next[i] = { ...next[i], x, y, vx, vy };
        }
        return next;
      });
      animationFrame = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  // Mouse move and down logic for cursor push
  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        mouse.current.x = e.clientX - rect.left;
        mouse.current.y = e.clientY - rect.top;
      }
    }
    function onMouseEnter() {
      mouse.current.active = true;
    }
    function onMouseLeave() {
      mouse.current.active = false;
    }
    const el = containerRef.current;
    if (el) {
      el.addEventListener("mousemove", onMouseMove);
      el.addEventListener("mouseenter", onMouseEnter);
      el.addEventListener("mouseleave", onMouseLeave);
    }
    return () => {
      if (el) {
        el.removeEventListener("mousemove", onMouseMove);
        el.removeEventListener("mouseenter", onMouseEnter);
        el.removeEventListener("mouseleave", onMouseLeave);
      }
    };
  }, []);

  // Mouse drag logic
  function handleMouseDown(idx: number, e: React.MouseEvent) {
    e.preventDefault();
    const startX = e.clientX;
    function onMouseMove(ev: MouseEvent) {
      const dx = ev.clientX - startX;
      setPositions((prev) =>
        prev.map((pos, i) =>
          i === idx ? { ...pos, vx: pos.vx + dx * 0.1 * pushStrength } : pos,
        ),
      );
    }
    function onMouseUp() {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    }
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[350px]"
      style={{ height: 350 }}
    >
      {skills.map((skill, i) => (
        <Link
          key={skill.id}
          href={`/skills/${encodeURIComponent(skill.name.toLowerCase())}`}
          className="skills-bubble flex items-center justify-center bg-linear-to-br from-blue-200 via-blue-100 to-blue-300 dark:from-navy-800 dark:via-navy-900 dark:to-navy-700 rounded-full shadow-2xl border-4 border-blue-300 dark:border-navy-700 transition-all duration-300 cursor-pointer select-none"
          style={{
            width: bubbleSize,
            height: bubbleSize,
            textDecoration: "none",
            position: "absolute",
            left: positions[i]?.x,
            top: positions[i]?.y,
            zIndex: 10 + i,
            userSelect: "none",
          }}
          title={skill.description || skill.name}
          onMouseDown={(e) => handleMouseDown(i, e)}
        >
          <span className="font-bold text-lg text-blue-900 dark:text-navy-100 drop-shadow-md text-center z-10">
            {skill.name}
          </span>
        </Link>
      ))}
    </div>
  );
}
