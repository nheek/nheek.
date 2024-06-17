import Head from 'next/head';
import Layout from '../../components/fun/layout';
import getTextsMap from '../../components/GetTextsMap';

export default function Fun() {
  const wwwNheekNo = {
    sitename: "fun | nheek no"
  };
  const wwwDefault = {
    sitename: "fun | nheek"
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
      <Layout />
    </>
  );
};