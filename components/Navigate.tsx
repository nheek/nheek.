import Link from "next/link";
import getTextsMap from "./utils/GetTextsMap";

export default function Navigate({ underPage = false }) {
  const wwwNheekNo = {
    txtSkills: "naviger",
  };
  const wwwDefault = {
    txtSkills: "navigate",
  };
  const domainPairs = {
    "www.nheek.no": wwwNheekNo,
    default: wwwDefault,
  };
  const textsMap = getTextsMap(domainPairs);
  const navLinks = [
    { name: "home", link: "/" },
    { name: "blog", link: "#" }, // blog about very small random things to very specific big things
    { name: "gallery", link: "/gallery" }, // maybe add a gallery page where i can showcase some of my favourite pictures
    { name: "cv", link: "/cv" }, // add page for your cv
    { name: "fun", link: "/fun" }, // post your spotify playlists here maybe or favourite shows or anything really
    { name: "links", link: "/links" }, // add links you want to add on your portfolio, like a friend's portfolio website
    { name: "logbook", link: "/logbook" }, // add something that allows visitor to submit something to show that they've been on my website
  ];

  return (
    <div
      className={`${underPage && "!p-0"} px-4 pt-[25%] md:pt-[15%] min-h-max`}
    >
      <section
        className={`${underPage ? "hidden" : "block"} text-4xl md:text-[4rem] xl:text-[6rem]`}
      >
        {textsMap.txtSkills}
      </section>
      <section
        className={`${underPage && "justify-center"} flex flex-wrap gap-4 text-md w-[90%] mt-8 md:mt-14 m-auto`}
      >
        {navLinks.map((link, index) => (
          <div
            className="w-max bg-[#1C2951] brightness-125 hover:brightness-[unset] hover:bg-gray-200 hover:text-blue-950 cursor-pointer rounded-3xl hover:mx-4 hover:scale-105 px-4 py-2 duration-500 hover:translateZ(0)"
            key={"navlinks" + index}
          >
            <Link className="!no-underline" href={link.link}>
              {link.name}
            </Link>
          </div>
        ))}
      </section>
    </div>
  );
}
