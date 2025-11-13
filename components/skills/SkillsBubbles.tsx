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
    const minSize = 80;
    const maxSize = 180;
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
        const next = prev.map((pos) => ({ ...pos }));
        const bubbleSizes = skills.map(skill => Math.max(minSize, Math.min(maxSize, 32 + skill.name.length * 12)));
        // Bubble-bubble collision (realistic physics)
        for (let i = 0; i < next.length; i++) {
          for (let j = i + 1; j < next.length; j++) {
            const a = next[i];
            const b = next[j];
            const sizeA = bubbleSizes[a.id];
            const sizeB = bubbleSizes[b.id];
            const dx = b.x + sizeB / 2 - (a.x + sizeA / 2);
            const dy = b.y + sizeB / 2 - (a.y + sizeA / 2);
            const dist = Math.sqrt(dx * dx + dy * dy);
            const collisionDist = (sizeA + sizeB) / 2;
            if (dist < collisionDist && dist > 0) {
              // Overlap resolution
              const overlap = collisionDist - dist;
              const nx = dx / dist;
              const ny = dy / dist;
              // Move bubbles apart proportional to their size (mass)
              const massA = sizeA * sizeA;
              const massB = sizeB * sizeB;
              const totalMass = massA + massB;
              a.x -= nx * (overlap * (massB / totalMass));
              a.y -= ny * (overlap * (massB / totalMass));
              b.x += nx * (overlap * (massA / totalMass));
              b.y += ny * (overlap * (massA / totalMass));
              // Realistic velocity exchange (elastic collision)
              const dvx = b.vx - a.vx;
              const dvy = b.vy - a.vy;
              const impact = dvx * nx + dvy * ny;
              if (impact < 0) {
                const impulse = (2 * impact) / (massA + massB);
                a.vx += impulse * massB * nx;
                a.vy += impulse * massB * ny;
                b.vx -= impulse * massA * nx;
                b.vy -= impulse * massA * ny;
              }
            }
          }
        }
        // Bubble movement and wall collision
        for (let i = 0; i < next.length; i++) {
          let { x, y, vx, vy } = next[i];
          const size = bubbleSizes[i];
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
            if (x > width - size) {
              x = width - size;
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
            const dx = x + size / 2 - mx;
            const dy = y + size / 2 - my;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < size / 2) {
              // Push away from cursor
              const force = (size / 2 - dist) * 0.2;
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
      {skills.map((skill, i) => {
        // Calculate bubble size based on text length (min 80px, max 180px)
        const textLength = skill.name.length;
        const minSize = 80;
        const maxSize = 180;
        const bubbleSizeDynamic = Math.max(minSize, Math.min(maxSize, 32 + textLength * 12));
        return (
          <div
            key={skill.id}
            className="skills-bubble flex items-center justify-center rounded-full border-4 transition-all duration-300 select-none"
            style={{
              width: bubbleSizeDynamic,
              height: bubbleSizeDynamic,
              background: "radial-gradient(circle at 40% 40%, #fff 0%, #B8E8D8 80%)",
              borderColor: "#7DB8A2",
              boxShadow: "0 4px 16px 0 rgba(27,77,62,0.12)",
              textDecoration: "none",
              position: "absolute",
              left: positions[i]?.x,
              top: positions[i]?.y,
              zIndex: 10 + i,
              userSelect: "none",
              overflow: "hidden",
            }}
            title={skill.description || skill.name}
            onMouseDown={(e) => handleMouseDown(i, e)}
          >
            <span
              className="font-bold text-lg text-center z-10"
              style={{
                color: "#1B4D3E",
                textShadow: "0 1px 6px #fff, 0 1px 0 #7DB8A2",
              }}
            >
              {skill.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
