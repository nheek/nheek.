"use client";

import Link from "next/link";

type NavigateProps = {
  underPage?: boolean;
  themeColor?: string;
};

export default function Navigate({
  underPage = false,
  themeColor,
}: NavigateProps) {
  // Function to determine if a color is light or dark
  const isLightColor = (color: string): boolean => {
    // Convert rgb/rgba to hex if needed
    let hex = color;

    if (color.startsWith("rgb")) {
      const match = color.match(/\d+/g);
      if (match) {
        const r = parseInt(match[0]);
        const g = parseInt(match[1]);
        const b = parseInt(match[2]);
        // Calculate relative luminance
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.5;
      }
    } else if (color.startsWith("#")) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.5;
    }

    return false;
  };

  const buttonBgColor = themeColor || "#172554"; // default blue-950
  const isLight = themeColor ? isLightColor(themeColor) : false;

  // Button text color: dark text for light backgrounds, white for dark backgrounds
  const buttonTextColor = isLight ? "#1f2937" : "#ffffff"; // gray-800 or white

  // Hover state: invert the colors
  const hoverBgColor = isLight ? "#1f2937" : "#e5e7eb"; // gray-800 or gray-200
  const hoverTextColor = isLight ? "#ffffff" : "#1f2937"; // white or gray-800

  const navLinks = [
    { name: "home", link: "/" },
    // { name: "blog", link: "#" }, // blog about very small random things to very specific big things
    { name: "gallery", link: "/gallery" }, // maybe add a gallery page where i can showcase some of my favourite pictures
    // { name: "cv", link: "/cv" }, // add page for your cv
    // { name: "fun", link: "/fun" }, // post your spotify playlists here maybe or favourite shows or anything really
    { name: "poems", link: "/poems" }, // finally my poems seeing the light of day
    { name: "links", link: "/links" }, // add links you want to add on your portfolio, like a friend's portfolio website
    { name: "wall", link: "/wall" }, // visitor contributions wall - graffiti, guestbook, songs, etc.
    { name: "q&a", link: "/qna" }, // ask me anything page
    { name: "polls", link: "/polls" }, // community polls and voting
  ];

  return (
    <div
      className={`${underPage ? "justify-center mt-4 mb-16" : "mt-8 md:mt-10"} w-[80%] flex flex-wrap justify-center gap-4 mx-auto text-md`}
    >
      {navLinks.map((link, index) => (
        <div
          className="w-max cursor-pointer rounded-full px-4 py-2 duration-300 transition-colors"
          style={{
            backgroundColor: buttonBgColor,
            color: buttonTextColor,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = hoverBgColor;
            e.currentTarget.style.color = hoverTextColor;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = buttonBgColor;
            e.currentTarget.style.color = buttonTextColor;
          }}
          key={"navlinks" + index}
        >
          <Link className="!no-underline" href={link.link}>
            {link.name}
          </Link>
        </div>
      ))}
    </div>
  );
}
