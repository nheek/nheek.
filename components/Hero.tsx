// import getTextsMap from "./utils/GetTextsMap";

export default function Hero() {
  return (
    <div className="w-[80%] mx-auto">
      <div className="flex items-center justify-between mt-20">
        <span
          title={"name's nick"}
          className="text-8xl md:text-[12rem]"
        >
          nheek
        </span>
        <div className="">
          <div className="bg-slate-200 rounded-full">
            <img
              className="w-40 h-40 p-4 rounded-full"
              src="https://next.nheek.com/index.php/apps/files_sharing/publicpreview/yqwfafeT4ggzqeB?file=/&fileId=5447&x=3420&y=2214&a=true&etag=2bc50050341c3ad0c7c545913c9fa15a"
              alt="nheek"
            />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between px-4">
        <div>
          <p className="font-semibold text-3xl">fullstack developer</p>
          <p>my code breathe life to applications</p>
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
