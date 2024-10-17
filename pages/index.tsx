import Head from "next/head";
import Layout from "../components/Layout";
import getTextsMap from "../components/GetTextsMap";

export default function Home() {
  const wwwNheekNo = {
    sitename: "nheek no",
  };
  const wwwDefault = {
    sitename: "nheek",
  };
  const domainPairs = {
    "www.nheek.no": wwwNheekNo,
    default: wwwDefault,
  };
  const textsMap = getTextsMap(domainPairs);

  return (
    <>
      <Head>
        <title>{textsMap.sitename}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Portfolio website of nheek" />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            textsMap.sitename,
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={textsMap.sitename} />
        <meta name="twitter:card" content="summary_large_image" />
        <script defer src="https://trck.nheek.com/script.js" data-website-id="74e002f4-f2a6-43b6-9045-840f9632e53a"></script>
      </Head>
      <Layout />
    </>
  );
}
