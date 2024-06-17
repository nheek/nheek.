import { useRouter } from 'next/router'
import Head from 'next/head';
import Layout from '../../components/LayoutC';
import getTextsMap from '../../components/get-texts-map';
// import FeaturedProjectsItem from '../../components/featured-projects-item';
import FeaturedProject from '../../components/projects/featured-project';
import Header from '../../components/HeaderC';
import Navigate from '../../components/navigate';

export default function Home() {
  const router = useRouter();
  const { projectName } : { projectName?: string } = router.query;
  
  const wwwNheekNo = {
    sitename: "nheek no"
  };
  const wwwDefault = {
    sitename: "nheek"
  };
  const domainPairs = {
    "www.nheek.no": wwwNheekNo, 
    default: wwwDefault
  };
  const textsMap = getTextsMap(domainPairs);
  
  return (
    <div className={"bg-[#1C2951] min-h-screen h-full text-white"}>
        <Header customHeaderText={projectName} />
        <Navigate underPage={true} />
        <FeaturedProject projectName={projectName}/>
    </div>
  );
};