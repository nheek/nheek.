import dynamic from "next/dynamic";
import Head from "next/head";
const Footer = dynamic(() => import("../../components/Footer"));
import Header from "../../components/Header";
import Navigate from "../../components/Navigate";
import getTextsMap from "../../components/GetTextsMap";
const FeaturedSongsHistory = dynamic(() => import("../../components/fun/featured-songs-history/FeaturedSongsHistory"));

export default function FunFeaturedSongs() {
    const wwwNheekNo = {
        pageName: "fun",
        sitename: "featured songs history | nheek no"
    };
    const wwwDefault = {
        pageName: "fun",
        sitename: "featured songs history | nheek"
    };
    const domainPairs = {
        "www.nheek.no": wwwNheekNo, 
        default: wwwDefault
    };
    const textsMap = getTextsMap(domainPairs);

    return (
        <>
            <Head>
                <title>{textsMap.sitename}</title>
                <link rel="icon" href="/favicon.ico" />
                <meta
                name="description"
                content="Random fun things that I want to showcase on my website like my Spotify playlists."
                />
                <meta
                property="og:image"
                content={`https://og-image.vercel.app/${encodeURI(
                    textsMap.sitename,
                )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
                />
                <meta name="og:title" content={textsMap.sitename} />
                <meta name="twitter:card" content="summary_large_image" />
            </Head>
            <div className={`bg-[#1C2951] min-h-screen h-full text-white`}>
                <Header customHeaderText={textsMap.pageName} />
                <Navigate underPage />
                <FeaturedSongsHistory />
                <Footer />
            </div>
        </>
    )
}