import dynamic from "next/dynamic";
import Header from "../Header";
import Navigate from "../Navigate";
import Main from "./Main";
const Footer = dynamic(() => import("../Footer"));

export default function Layout() {
  return (
    <div className={"bg-[#1C2951] min-h-screen h-full text-white"}>
      <Header customHeaderText="fun" />
      <Navigate underPage />
      <Main />
      <Footer />
    </div>
  );
}
