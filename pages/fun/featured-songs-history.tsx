import dynamic from "next/dynamic";
const Footer = dynamic(() => import("../../components/footer"));
import Header from "../../components/header";
import Navigate from "../../components/navigate";
import getTextsMap from "../../components/get-texts-map";
const FeaturedSongsHistory = dynamic(() => import("../../components/fun/featured-songs-history/featured-songs-history"));

export default function FunFeaturedSongs() {
    const wwwNheekNo = {
        pageName: "fun"
    };
    const wwwDefault = {
        pageName: "fun"
    };
    const domainPairs = {
        "www.nheek.no": wwwNheekNo, 
        default: wwwDefault
    };
    const textsMap = getTextsMap(domainPairs);

    return (
        <div className={`bg-[#1C2951] min-h-screen h-full text-white`}>
            <Header customHeaderText={textsMap.pageName} />
            <Navigate underPage />
            <FeaturedSongsHistory />
            <Footer />
        </div>
    )
}