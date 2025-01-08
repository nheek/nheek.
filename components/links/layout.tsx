import dynamic from "next/dynamic";
import Header from "../Header";
import Main from "./main";
const Footer = dynamic(() => import("../Footer"));
import Navigate from "../Navigate";
// import getTextsMap from "../utils/GetTextsMap";

export default function Layout() {

  return (
    <div className={"w-[80%] mx-auto"}>
      <Header customHeaderText={"links"} />
      <Navigate underPage={true} />
      <Main />
      <Footer />
    </div>
  );
}
