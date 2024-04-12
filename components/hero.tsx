import { text } from 'stream/consumers';
import getTextsMap from '../components/get-texts-map';

export default function Hero({isFullStack}) {
  const wwwNheekNo = {
    sitename: "nheek no",
    heroText: "hei! jeg er nheek. kodene mine gir liv til nettsider og applikasjoner. la dine ideer bli virkelighet.",
    realName: "heter egentlig nick",
  };
  const wwwDefault = {
    sitename: "nheek",
    heroText: "hi! im nheek. my codes breathe life to websites and applications. let your ideas come to life.",
    realName: "real name is nick",
  };
  const domainPairs = {
    "www.nheek.no": wwwNheekNo, 
    default: wwwDefault
  };
  const textsMap = getTextsMap(domainPairs);

  return (
    
    <div className="px-4 pb-4 pt-20 min-h-max">
      <section
        title={textsMap.realName}
        className="text-8xl md:text-[12rem] text-right"
      >
        {textsMap.sitename}
      </section>
      <section className="text-xl md:text-3xl leading-snug w-[90%]">
        {isFullStack ? "So it is foretold" : textsMap.heroText}
      </section>
    </div>
  );
}
