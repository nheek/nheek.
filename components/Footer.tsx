import Link from "next/link";
import getTextsMap from "./utils/GetTextsMap";

export default function Footer() {
  const wwwNheekNo = {
    fullStack: "fullstack utvikler",
    sitename: "nheek no",
    currentLang: "norsk",
    link: "https://www.nheek.com",
    addStyles: {
      footer: "h-[50vh]",
      nav1: "md:w-[15.5%]",
      h1: "md:w-[45%]",
      nav2: "md:w-[15.5%]",
    },
  };
  const wwwDefault = {
    fullStack: "fullstack developer",
    sitename: "nheek",
    currentLang: "english",
    link: "https://www.nheek.no",
    addStyles: {
      footer: "h-[30vh]",
      nav1: "md:w-[23%]",
      h1: "md:w-[30%]",
      nav2: "md:w-[23%]",
    },
  };
  const domainPairs = {
    "www.nheek.no": wwwNheekNo,
    default: wwwDefault,
  };
  const textsMap = getTextsMap(domainPairs);

  return (
    <footer
      className={
        textsMap.addStyles.footer +
        ` md:h-[20vh] mt-[30%] md:mt-[8%] pb-8 flex flex-col md:flex-row gap-[10%] items-center justify-center md:items-end`
      }
    >
      <ul className={textsMap.addStyles.nav1}>
        <li>{textsMap.fullStack}</li>
      </ul>

      <Link
        href="/"
        className={
          textsMap.addStyles.h1 +
          ` text-center text-8xl font-bold !no-underline`
        }
      >
        <h1>{textsMap.sitename}</h1>
      </Link>

      <ul className={textsMap.addStyles.nav2 + ` text-right`}>
        <li>
          <Link className="!no-underline" href={textsMap.link}>
            {textsMap.currentLang}
          </Link>
        </li>
      </ul>
    </footer>
  );
}
