import Link from "next/link";
import { TbHandFingerRight, TbHandFingerLeft } from "react-icons/tb";
import { FaGithub, FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

export const siteTitle = "nheek";

type HeaderProps = {
  compact?: boolean;
  currentPage?: "home" | "music";
  customHeaderText?: string;
  themeColor?: string;
};

export default function Header({
  compact = false,
  currentPage = "home",
  customHeaderText,
  themeColor,
}: HeaderProps) {
  const textColor = themeColor || "inherit";

  if (compact) {
    return (
      <div className="w-[85%] mx-auto py-8" style={{ color: textColor }}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/">
            <span
              className="text-5xl md:text-6xl hover:opacity-70 transition-opacity"
              title="name's nick"
            >
              {customHeaderText || "nheek"}
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <div className="bg-slate-200 rounded-full">
              <img
                className="w-20 h-20 p-0.5 rounded-full"
                src="https://flies.nheek.com/uploads/nheek/pfp/pfp"
                alt="nheek"
              />
            </div>
            <div className="hidden md:flex flex-col">
              <p className="text-lg font-semibold">
                fullstack developer | songwriter
              </p>
              <p className="text-sm text-gray-400">
                my lyrics breathe life into emotions
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/nheek"
              className="hover:opacity-70 transition-opacity"
              style={{ color: textColor }}
            >
              <FaGithub className="w-5 h-5" />
            </a>
            <a
              href="https://www.facebook.com/nick.james.1622"
              className="hover:opacity-70 transition-opacity"
              style={{ color: textColor }}
            >
              <FaFacebook className="w-5 h-5" />
            </a>
            <a
              href="https://www.instagram.com/nick.mmrdl"
              className="hover:opacity-70 transition-opacity"
              style={{ color: textColor }}
            >
              <FaInstagram className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/nheek"
              className="hover:opacity-70 transition-opacity"
              style={{ color: textColor }}
            >
              <FaLinkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
        {/* Mobile tagline */}
        <div className="md:hidden text-center mt-4">
          <p className="text-base font-semibold">
            fullstack developer | songwriter
          </p>
          <p className="text-sm text-gray-400">
            my lyrics breathe life into emotions
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[85%] mx-auto" style={{ color: textColor }}>
      <div className="flex flex-col md:flex-row items-center justify-between pt-20">
        <span className="text-8xl md:text-[12rem]" title="name's nick">
          nheek
        </span>
        <div>
          <div className="bg-slate-200 rounded-full">
            <img
              className="w-40 h-40 p-3 rounded-full"
              src="https://flies.nheek.com/uploads/nheek/pfp/pfp"
              alt="nheek"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col-reverse md:flex-row gap-2 md:gap-0 items-center justify-between mt-10 md:mt-0 px-4">
        <div className="text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 justify-center">
            <div className="flex gap-2 items-center">
              <TbHandFingerRight
                className="text-xl transition-colors"
                style={{
                  color: currentPage === "home" ? themeColor || "#a78bfa" : "",
                }}
              />
              <Link
                href="/"
                className={`transition-colors text-2xl sm:text-3xl font-semibold ${
                  currentPage === "home"
                    ? "hover:opacity-80"
                    : "hover:text-blue-400"
                }`}
                style={{
                  color: currentPage === "home" ? themeColor || "#60a5fa" : "",
                }}
              >
                fullstack developer
              </Link>
            </div>
            <span className="hidden sm:inline text-3xl">|</span>
            <div className="flex gap-2 items-center">
              <Link
                href="/music"
                className={`transition-colors text-2xl sm:text-3xl font-semibold ${
                  currentPage === "music"
                    ? "hover:opacity-80"
                    : "hover:text-purple-400"
                }`}
                style={{
                  color: currentPage === "music" ? themeColor || "#c45a74" : "",
                }}
              >
                songwriter
              </Link>
              <TbHandFingerLeft
                className="text-xl transition-colors"
                style={{
                  color: currentPage === "music" ? themeColor || "#c45a74" : "",
                }}
              />
            </div>
          </div>
          <p>my lyrics breathe life into emotions</p>
        </div>
        <div className="flex items-center gap-10">
          <a
            href="https://github.com/nheek"
            className="hover:opacity-70 transition-opacity"
            style={{ color: textColor }}
          >
            <FaGithub className="w-6 h-6" />
          </a>
          <a
            href="https://www.facebook.com/nick.james.1622"
            className="hover:opacity-70 transition-opacity"
            style={{ color: textColor }}
          >
            <FaFacebook className="w-6 h-6" />
          </a>
          <a
            href="https://www.instagram.com/nick.mmrdl"
            className="hover:opacity-70 transition-opacity"
            style={{ color: textColor }}
          >
            <FaInstagram className="w-6 h-6" />
          </a>
          <a
            href="https://www.linkedin.com/in/nheek"
            className="hover:opacity-70 transition-opacity"
            style={{ color: textColor }}
          >
            <FaLinkedin className="w-6 h-6" />
          </a>
        </div>
      </div>
    </div>
  );
}
