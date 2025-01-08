import dynamic from "next/dynamic";
import Header from "../Header";
import Navigate from "../Navigate";
import Main from "./Main";
const Footer = dynamic(() => import("../Footer"));

export default function Layout() {
  return (
    <div className={"w-[80%] mx-auto"}> 
      <Header customHeaderText="fun" />
      <Navigate underPage />
      <Main />
      <Footer />
    </div>
  );
}
