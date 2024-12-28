import Link from "next/link";
import getTextsMap from "../utils/GetTextsMap";

export default function FeaturedSongs() {
  const spotify = [
    {
      title: "23 june 2024",
      collection: [
        {
          code: `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/0hhzNPE68LWLfgZwdpxVdR?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`,
        },
        {
          code: `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/73c7iqH4lCVqu4tm66i0tY?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`,
        },
        {
          code: `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/5MPi9e7z46wopyad10R6qx?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`,
        },
        {
          code: `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/5N3hjp1WNayUPZrA8kJmJP?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`,
        },
        {
          code: `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/5Jh1i0no3vJ9u4deXkb4aV?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`,
        },
      ],
    },
  ];

  const wwwNheekNo = {
    txtSpotify: "utvalgte låter",
    dateChanged: "dato endret",
    links: spotify,
  };

  const wwwDefault = {
    txtSpotify: "featured songs",
    dateChanged: "date changed",
    links: spotify,
  };

  const domainPairs = {
    "www.nheek.no": wwwNheekNo,
    default: wwwDefault,
  };

  const textsMap = getTextsMap(domainPairs);

  return (
    <section className="px-4 pt-[25%] md:pt-[15%] min-h-max">
      <hgroup className="text-4xl md:text-[4rem] xl:text-[8rem]">
        {textsMap.txtSpotify}
      </hgroup>
      <h3 className="mt-12 pl-8">
        {`${textsMap.dateChanged}: ${textsMap.links[0].title}`}
      </h3>
      <div className="flex flex-wrap gap-2 text-lg w-full md:w-[90%] mt-4 m-auto leading-8">
        {textsMap.links[0].collection.map((spotifyItem, index) => (
          <div key={"spotify-item-" + index} className="w-full">
            <div dangerouslySetInnerHTML={{ __html: spotifyItem.code }} />
          </div>
        ))}
      </div>
      <Link
        href="/fun/featured-songs-history"
        className="block w-max bg-[#1C2951] brightness-125 hover:brightness-[unset] hover:bg-gray-200 hover:text-blue-950 my-6 mx-auto py-2 px-4 text-center rounded-3xl !no-underline duration-500"
      >
        See history
      </Link>
    </section>
  );
}
