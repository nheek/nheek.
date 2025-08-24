export default function Hero() {
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
          <p className="font-semibold text-3xl">fullstack developer</p>
          <p>my code breathes life into applications</p>
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
