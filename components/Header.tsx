import Link from "next/link";
import { TbHandFingerRight, TbHandFingerLeft } from "react-icons/tb";

export const siteTitle = "nheek";

type HeaderProps = {
  compact?: boolean;
  currentPage?: "home" | "music";
};

export default function Header({ compact = false, currentPage = "home" }: HeaderProps) {
  if (compact) {
    return (
      <div className="w-[85%] mx-auto py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link
            href="/"
            className="text-5xl md:text-6xl hover:opacity-70 transition-opacity"
            title="name's nick"
          >
            nheek
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
              <p className="text-lg font-semibold">fullstack developer | songwriter</p>
              <p className="text-sm text-gray-400">
                my lyrics breathe life into emotions
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/nheek"
              className="hover:opacity-70 transition-opacity"
            >
              <img
                src="/social-links/github.svg"
                alt="github icon"
                className="w-5 h-5"
              />
            </a>
            <a
              href="https://www.facebook.com/nick.james.1622"
              className="hover:opacity-70 transition-opacity"
            >
              <img
                src="/social-links/facebook.svg"
                alt="facebook icon"
                className="w-5 h-5"
              />
            </a>
            <a
              href="https://github.com/nheek"
              className="hover:opacity-70 transition-opacity"
            >
              <img
                src="/social-links/instagram.svg"
                alt="instagram icon"
                className="w-5 h-5"
              />
            </a>
            <a
              href="https://github.com/nheek"
              className="hover:opacity-70 transition-opacity"
            >
              <img
                src="/social-links/linkedin.svg"
                alt="linkedin icon"
                className="w-5 h-5"
              />
            </a>
          </div>
        </div>
        {/* Mobile tagline */}
        <div className="md:hidden text-center mt-4">
          <p className="text-base font-semibold">fullstack developer | songwriter</p>
          <p className="text-sm text-gray-400">
            my lyrics breathe life into emotions
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[85%] mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between pt-20">
        <Link
          href="/"
          className="text-8xl md:text-[12rem] hover:opacity-70 transition-opacity"
          title="name's nick"
        >
          nheek
        </Link>
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
          <div className="flex items-center gap-4 justify-center">
            <div className="flex gap-2 items-center">
              <TbHandFingerRight
                className={`text-xl transition-colors ${
                  currentPage === "home" ? "text-purple-400" : ""
                }`}
              />
              <Link
                href="/"
                className={`transition-colors text-3xl font-semibold ${
                  currentPage === "home"
                    ? "text-purple-400 hover:text-purple-300"
                    : "hover:text-purple-400"
                }`}
              >
                fullstack developer
              </Link>
            </div>
            <span className="text-3xl">|</span>
            <div className="flex gap-2 items-center">
              <Link
                href="/music"
                className={`transition-colors text-3xl font-semibold ${
                  currentPage === "music"
                    ? "text-purple-400 hover:text-purple-300"
                    : "hover:text-purple-400"
                }`}
              >
                songwriter
              </Link>
              <TbHandFingerLeft
                className={`text-xl transition-colors ${
                  currentPage === "music" ? "text-purple-400" : ""
                }`}
              />
            </div>
          </div>
          <p>my lyrics breathe life into emotions</p>
        </div>
        <div className="flex items-center gap-10">
          <a
            href="https://github.com/nheek"
            className="hover:opacity-70 transition-opacity"
          >
            <img src="/social-links/github.svg" alt="github icon" />
          </a>
          <a
            href="https://www.facebook.com/nick.james.1622"
            className="hover:opacity-70 transition-opacity"
          >
            <img src="/social-links/facebook.svg" alt="facebook icon" />
          </a>
          <a
            href="https://github.com/nheek"
            className="hover:opacity-70 transition-opacity"
          >
            <img src="/social-links/instagram.svg" alt="instagram icon" />
          </a>
          <a
            href="https://github.com/nheek"
            className="hover:opacity-70 transition-opacity"
          >
            <img src="/social-links/linkedin.svg" alt="linkedin icon" />
          </a>
        </div>
      </div>
    </div>
  );
}

