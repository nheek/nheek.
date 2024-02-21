import Header from '../components/header';
import Main from '../components/main';
import Footer from '../components/footer';
import { useState } from 'react';

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