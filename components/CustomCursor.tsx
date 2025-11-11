"use client";

import { useState, useEffect } from "react";

export default function CustomCursor() {
  const [cursorUrl, setCursorUrl] = useState<string | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);

  useEffect(() => {
    // Fetch cursor image URL from API
    fetch("/api/settings/cursor")
      .then((res) => res.json())
      .then((data) => {
        if (data.cursor_image_url) {
          setCursorUrl(data.cursor_image_url);
        }
      })
      .catch((error) => {
        console.error("Failed to load cursor image:", error);
      });

    // Check if element or any parent is clickable
    const isClickableElement = (element: Element | null): boolean => {
      if (!element) return false;
      
      let currentElement: Element | null = element;
      let depth = 0;
      
      // Check up to 5 parent levels
      while (currentElement && depth < 5) {
        const tagName = currentElement.tagName.toLowerCase();
        const clickableTags = [
          "a",
          "button",
          "input",
          "textarea",
          "select",
          "label",
        ];
        
        // Check if it's a clickable tag
        if (clickableTags.includes(tagName)) return true;
        
        // Check if it has click handlers or cursor pointer (before we set it to none)
        if (currentElement.hasAttribute("onclick")) return true;
        
        // Check if it's a clickable role
        const role = currentElement.getAttribute("role");
        if (
          role &&
          ["button", "link", "menuitem", "tab"].includes(role)
        )
          return true;
        
        // Check for common interactive classes
        const classList = currentElement.className;
        if (
          typeof classList === "string" &&
          (classList.includes("cursor-pointer") ||
            classList.includes("clickable") ||
            classList.includes("hover:"))
        ) {
          return true;
        }
        
        // Move to parent
        currentElement = currentElement.parentElement;
        depth++;
      }
      
      return false;
    };

    // Track mouse position and detect clickable elements
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
      
      // Check if hovering over clickable element or its parent
      const target = e.target as Element;
      setIsHoveringClickable(isClickableElement(target));
    };

    // Track clicks for animation
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    // Hide cursor when leaving window
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  if (!cursorUrl || !isVisible) return null;

  return (
    <div
      className="fixed pointer-events-none z-[9999] transition-transform duration-100 ease-out"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `translate(-50%, -50%) scale(${isClicking ? 0.8 : 1}) rotate(${isClicking ? -15 : 0}deg)`,
      }}
    >
      <img
        src={cursorUrl}
        alt="Custom cursor"
        className={`w-8 h-8 rounded-full object-cover border-2 transition-all duration-200 ${
          isHoveringClickable
            ? "border-blue-400 scale-110 animate-[pulse-glow_1.5s_ease-in-out_infinite]"
            : "border-white/80 shadow-lg"
        }`}
        draggable={false}
        style={
          isHoveringClickable
            ? {
                boxShadow:
                  "0 0 10px rgba(96, 165, 250, 0.5), 0 0 20px rgba(96, 165, 250, 0.3)",
              }
            : undefined
        }
      />
    </div>
  );
}
