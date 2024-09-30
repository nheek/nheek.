import { useState } from "react";
import dynamic from "next/dynamic";
import Header from "./Header";
import Main from "./Main";
const Footer = dynamic(() => import("./Footer"));

export default function Layout() {
  return (
    <div className={"bg-[#1C2951] min-h-screen h-full text-white"}>
      <Header />
      <Main />
      <Footer />
    </div>
  );
}
