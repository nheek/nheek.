import { useRouter } from 'next/router';
// import getTextsMap from '../../components/GetTextsMap';
import FeaturedProject from '../../components/unused - projects/featured-project';
import Header from '../../components/Header';
import Navigate from '../../components/Navigate';

export default function Home() {
  const router = useRouter();
  const { projectName } : { projectName?: string } = router.query;
  // const wwwNheekNo = {
  //   sitename: "nheek no"
  // };
  // const wwwDefault = {
  //   sitename: "nheek"
  // };
  // const domainPairs = {
  //   "www.nheek.no": wwwNheekNo,
  //   default: wwwDefault
  // };
  // const textsMap = getTextsMap(domainPairs);
  
  return (
    <div className={"bg-[#1C2951] min-h-screen h-full text-white"}>
        <Header customHeaderText={projectName} />
        <Navigate underPage />
        <FeaturedProject projectName={projectName}/>
    </div>
  );
};