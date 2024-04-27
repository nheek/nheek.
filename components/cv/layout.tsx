import dynamic from 'next/dynamic';
import Header from '../../components/header';
import Navigate from '../navigate';
import Main from './main';
const Footer = dynamic(() => import("../footer"));

export default function Layout() {
  return (
    <div className={"bg-[#1C2951] min-h-screen h-full text-white"}>
      <Header customHeaderText="cv" />
      <Navigate underPage={true} />
      <Main />
      <Footer />
    </div >
  );
}