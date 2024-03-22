import Link from 'next/link';
import getTextsMap from '../components/get-texts-map';
import { useState } from 'react';

export const siteTitle = 'nheek';

export default function Header({isFullStack = null, setIsFullStack = null, customHeaderText=""}) {
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
  const [fullStackCounter, setIsFullStackCounter] = useState(0);

  const handleFullStack = () => {
    setIsFullStackCounter(fullStackCounter + 1);
    if (fullStackCounter == 3) {
      setIsFullStack(true);
      setIsFullStackCounter(fullStackCounter + 1);
      console.log("nicr")
      console.log(isFullStack)
    }
    console.log(isFullStack)

  }
  return (
    <header className="flex h-[10vh] items-center justify-center">
      <nav className="w-[25%]">
        <ul>
          <li className="cursor-pointer">
            <button
              className="text-left"
              onClick={handleFullStack}
            >
              {textsMap.fullStack}
            </button>
          </li>
        </ul>
      </nav>

      <div className="w-[45%] text-4xl text-center">{customHeaderText}</div>
      <nav className="w-[25%] text-right">
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