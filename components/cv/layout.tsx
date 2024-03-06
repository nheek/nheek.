import Header from '../../components/header';
import Main from './main';
import Footer from '../../components/footer';
import Navigate from '../navigate';

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