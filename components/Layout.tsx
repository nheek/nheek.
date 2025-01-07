import dynamic from "next/dynamic";
// import Header from "./Header";
import Main from "./Main";
const Footer = dynamic(() => import("./Footer"));

export default function Layout() {
  return (
    <div className={"bg-slate-100 min-h-screen h-full"}>
      {/* <Header /> */}
      <Main />
      <Footer />
    </div>
  );
}
