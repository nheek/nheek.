import dynamic from 'next/dynamic';
import Header from '../Header';
import Main from './main';
const Footer = dynamic(() => import("../Footer"));
import Navigate from '../navigate';
import getTextsMap from '../GetTextsMap';

export default function Layout() {
  const wwwNheekNo = {
    pageName: "lenker"
  };
  const wwwDefault = {
      pageName: "links"
  };
  const domainPairs = {
      "www.nheek.no": wwwNheekNo, 
      default: wwwDefault
  };
  const textsMap = getTextsMap(domainPairs);

  return (
    <div className={"bg-[#1C2951] min-h-screen h-full text-white"}>
      <Header customHeaderText={textsMap.pageName} />
      <Navigate underPage={true} />
      <Main />
      <Footer />
    </div >
  );
}