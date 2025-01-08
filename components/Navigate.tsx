import Link from "next/link";
// import getTextsMap from "./utils/GetTextsMap";

export default function Navigate({ underPage = false }) {
  const navLinks = [
    { name: "home", link: "/" },
    // { name: "blog", link: "#" }, // blog about very small random things to very specific big things
    { name: "gallery", link: "/gallery" }, // maybe add a gallery page where i can showcase some of my favourite pictures
    // { name: "cv", link: "/cv" }, // add page for your cv
    { name: "fun", link: "/fun" }, // post your spotify playlists here maybe or favourite shows or anything really
    { name: "links", link: "/links" }, // add links you want to add on your portfolio, like a friend's portfolio website
    // { name: "logbook", link: "/logbook" }, // add something that allows visitor to submit something to show that they've been on my website
  ];

  return (
    <div className={`${underPage && "!p-0"} w-[90%] mt-6 mx-auto`}>
      {/* <section
        className={`${underPage ? "hidden" : "block"} text-4xl md:text-[4rem] xl:text-[6rem]`}
      >
        menu
      </section> */}
      <section
        className={`${underPage && "justify-center"} flex flex-wrap justify-center gap-4 text-md mt-8 md:mt-10`}
      >
        {navLinks.map((link, index) => (
          <div
            className="w-max bg-blue-950 hover:bg-gray-200 text-white hover:text-blue-950 cursor-pointer rounded-full px-4 py-2 duration-300"
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
