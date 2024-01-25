import Link from 'next/link';
import getTextsMap from '../components/get-texts-map';

export const siteTitle = 'nheek';

export default function Header() {
  const wwwNheekNo = {
    fullStack: "fullstack utvikler",
    sitename: "nheek no",
    currentLang: "norsk",
    link: "https://www.nheek.com"
  };
  const wwwDefault = {
    fullStack: "fullstack developer",
    sitename: "nheek",
    currentLang: "english",
    link: "https://www.nheek.no"
  };
  const domainPairs = {
    "www.nheek.no": wwwNheekNo, 
    default: wwwDefault
  };
  const textsMap = getTextsMap(domainPairs);

  return (
    <header className="flex h-[10vh] items-center justify-center">
      <nav className="w-[33%]">
        <ul>
          <li className="cursor-pointer">{textsMap.fullStack}</li>
        </ul>
      </nav>

      <div className="w-[30%]"></div>
      <nav className="w-[33%] text-right">
        <ul>
          <li>
            <Link
              className='!no-underline'
              href={textsMap.link}
            >
              {textsMap.currentLang}
            </Link>
            </li>
        </ul>
      </nav>
    </header>
  );
}