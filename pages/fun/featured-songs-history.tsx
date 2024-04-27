import dynamic from "next/dynamic";
const Footer = dynamic(() => import("../../components/footer"));
import Header from "../../components/header";
import Navigate from "../../components/navigate";
const FeaturedSongsHistory = dynamic(() => import("../../components/fun/featured-songs-history/featured-songs-history"));

export default function FunFeaturedSongs() {
    return (
        <div className={`bg-[#1C2951] min-h-screen h-full text-white`}>
            <Header />
            <Navigate underPage />
            <FeaturedSongsHistory />
            <Footer />
        </div>
    )
}