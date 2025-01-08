import dynamic from "next/dynamic";
import Header from "../Header";
import Main from "./main";
const Footer = dynamic(() => import("../Footer"));
import Navigate from "../Navigate";
import getTextsMap from "../utils/GetTextsMap";

export default function Layout() {
  const wwwNheekNo = {
    pageName: "galleri",
  };
  const wwwDefault = {
    pageName: "gallery",
  };
  const domainPairs = {
    "www.nheek.no": wwwNheekNo,
    default: wwwDefault,
  };
  const textsMap = getTextsMap(domainPairs);

  return (
    <div className={"w-[80%] mx-auto min-h-screen h-full"}>
      <Header customHeaderText={textsMap.pageName} />
      <Navigate underPage />
      <Main />
      <Footer />
    </div>
  );
}
