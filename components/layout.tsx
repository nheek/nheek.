import Header from '../components/header';
import Main from '../components/main';
import Footer from '../components/footer';

export default function Layout() {
  return (
    <div className={"bg-[#1C2951] min-h-screen h-full text-white"}>
      <Header />
      <Main />
      <Footer />
    </div >
  );
}