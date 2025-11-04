import { TbHandFingerRight, TbHandFingerLeft } from "react-icons/tb";

type HeroProps = {
  mode: "developer" | "songwriter";
  onModeChange: (mode: "developer" | "songwriter") => void;
};

export default function Hero({ mode, onModeChange }: HeroProps) {
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
              src="https://flies.nheek.com/uploads/nheek/pfp/pfp.jpg"
              alt="nheek"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col-reverse md:flex-row gap-2 md:gap-0 items-center justify-between mt-10 md:mt-0 px-4">
        <div className="text-center md:text-left">
          <div className="flex items-center gap-4 justify-center">
            <div className="flex gap-2 items-center">
              <TbHandFingerRight className="text-xl" />
              <button
                onClick={() => onModeChange("developer")}
                className="cursor-pointer font-semibold text-3xl hover:opacity-70 transition-opacity"
              >
                fullstack developer
              </button>
            </div>
            {<span className="text-3xl">|</span>}
            <div className="flex gap-2 items-center">
              <button
                onClick={() => onModeChange("songwriter")}
                className="cursor-pointer font-semibold text-3xl hover:opacity-70 transition-opacity"
              >
                songwriter
              </button>
              <TbHandFingerLeft className="text-xl" />
            </div>
          </div>
          <p>
            {mode === "developer"
              ? "my code breathes life into applications"
              : "my melodies breathe life into emotions"}
          </p>
        </div>
        <div className="flex items-center gap-10">
          <a href="https://github.com/nheek">
            <img src="/social-links/github.svg" alt="github icon" />
          </a>
          <a href="https://www.facebook.com/nick.james.1622">
            <img src="/social-links/facebook.svg" alt="facebook icon" />
          </a>
          <a href="https://github.com/nheek">
            <img src="/social-links/instagram.svg" alt="instagram icon" />
          </a>
          <a href="https://github.com/nheek">
            <img src="/social-links/linkedin.svg" alt="linkedin icon" />
          </a>
        </div>
      </div>
    </div>
  );
}
