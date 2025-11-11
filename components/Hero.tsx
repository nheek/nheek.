import { TbHandFingerRight, TbHandFingerLeft } from "react-icons/tb";
import { FaGithub, FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import Link from "next/link";

type HeroProps = {
  mode: "developer" | "songwriter";
  onModeChange: (mode: "developer" | "songwriter") => void;
  themeColor?: string;
};

export default function Hero({ mode, onModeChange, themeColor }: HeroProps) {
  return (
    <div className="w-[85%] mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between pt-20">
        <span title={"name's nick"} className="text-8xl md:text-[12rem]">
          nheek
        </span>
        <div className="">
          <div className="bg-slate-200 rounded-full">
            <img
              className="w-40 h-40 p-3 rounded-full"
              src="https://flies.nheek.com/uploads/nheek/pfp/pfp-main.jpg"
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
                  color:
                    mode === "developer"
                      ? themeColor || "rgb(96, 165, 250)"
                      : "",
                }}
              />
              <Link
                href="/"
                className={`cursor-pointer font-semibold text-2xl sm:text-3xl transition-colors ${
                  mode === "developer" ? "hover:opacity-80" : "hover:text-blue-400"
                }`}
                style={{
                  color:
                    mode === "developer"
                      ? themeColor || "rgb(96, 165, 250)"
                      : "",
                }}
              >
                fullstack developer
              </Link>
            </div>
            <span className="hidden sm:inline text-3xl">|</span>
            <div className="flex gap-2 items-center">
              <Link
                href="/music"
                className={`cursor-pointer font-semibold text-2xl sm:text-3xl transition-colors ${
                  mode === "songwriter" ? "hover:opacity-80" : "hover:text-[#c45a74]"
                }`}
                style={{
                  color: mode === "songwriter" ? themeColor || "#c45a74" : "",
                }}
              >
                songwriter
              </Link>
              <TbHandFingerLeft
                className="text-xl transition-colors"
                style={{
                  color: mode === "songwriter" ? themeColor || "#c45a74" : "",
                }}
              />
            </div>
          </div>
          <p>
            {mode === "developer"
              ? "my code breathes life into applications"
              : "my lyrics breathe life into emotions"}
          </p>
        </div>
        <div className="flex items-center gap-10">
          <a
            href="https://github.com/nheek"
            className="hover:opacity-70 transition-opacity"
            style={{ color: themeColor }}
          >
            <FaGithub className="w-6 h-6" />
          </a>
          <a
            href="https://www.facebook.com/nick.james.1622"
            className="hover:opacity-70 transition-opacity"
            style={{ color: themeColor }}
          >
            <FaFacebook className="w-6 h-6" />
          </a>
          <a
            href="https://www.instagram.com/nick.mmrdl"
            className="hover:opacity-70 transition-opacity"
            style={{ color: themeColor }}
          >
            <FaInstagram className="w-6 h-6" />
          </a>
          <a
            href="https://www.linkedin.com/in/nick-mmrdl"
            className="hover:opacity-70 transition-opacity"
            style={{ color: themeColor }}
          >
            <FaLinkedin className="w-6 h-6" />
          </a>
        </div>
      </div>
    </div>
  );
}
