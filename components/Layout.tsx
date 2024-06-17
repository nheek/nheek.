import { useState } from 'react';
import dynamic from 'next/dynamic';
import Header from './Header';
import Main from './main';
const Footer = dynamic(() => import('./Footer'));

export default function Layout() {
  const [isFullStack, setIsFullStack] = useState(false);

  return (
    <div className={"bg-[#1C2951] min-h-screen h-full text-white"}>
      <Header isFullStack={isFullStack} setIsFullStack={setIsFullStack} />
      <Main isFullStack={isFullStack} />
      <Footer />
    </div >
  );
}