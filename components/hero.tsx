import getTextsMap from '../components/get-texts-map';

export default function Hero() {
  const wwwNheekNo = {
    sitename: "nheek no",
    heroText: "hei! jeg er nheek. kodene mine gir liv til nettsider og applikasjoner. la dine ideer bli virkelighet."
  };
  const wwwDefault = {
    sitename: "nheek",
    heroText: "hi! im nheek. my codes breathe life to websites and applications. let your ideas come to life."
  };
  const domainPairs = {
    "www.nheek.no": wwwNheekNo, 
    default: wwwDefault
  };
  const textsMap = getTextsMap(domainPairs);

  return (
    
    <div className="px-6 pb-4 pt-20 min-h-max">
       <section className="text-8xl md:text-[12rem] text-right">
          {textsMap.sitename}
        </section>
        <section className="text-xl md:text-3xl leading-snug w-[90%]">
          {textsMap.heroText}
        </section>
    </div>
  );
}
