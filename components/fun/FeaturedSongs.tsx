import Link from 'next/link';
import DOMPurify from 'dompurify';
import getTextsMap from '../GetTextsMap';

export default function FeaturedSongs() {
  const spotify = [
    { title: "28 april 2024",
      collection:
      [
        {
          code:  `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/5og4Qzt92jJzVDkOtSEilb?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`
        },
        {
          code: `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/7Mts0OfPorF4iwOomvfqn1?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`
        },
        {
          code: `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/0W0iAC1VGlB82PI6elxFYf?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`
        },
        {
          code: `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/2OzhQlSqBEmt7hmkYxfT6m?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`
        },
        {
          code: `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/2F3N9tdombb64aW6VtZOdo?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`
        }
      ]
    }
  ]

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
    default: wwwDefault
  }

  let textsMap = getTextsMap(domainPairs);

  return (
    <section className="px-4 pt-[25%] md:pt-[15%] min-h-max">
        <hgroup className="text-4xl md:text-[4rem] xl:text-[8rem]">
          {textsMap.txtSpotify}
        </hgroup>
        <h3 className="mt-12 pl-8">
          {`${textsMap.dateChanged}: ${textsMap.links[0].title}`}
        </h3>
        <div className="flex flex-wrap gap-2 text-lg w-full md:w-[90%] mt-4 m-auto leading-8">
            {
              textsMap.links[0].collection.map((spotifyItem, index) => (
                <div
                  key={"spotify-item-" + index}
                  className="w-full"
                >
                  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(spotifyItem.code) }} />
                </div>
              ))
            }
        </div>
        <Link
          href="/fun/featured-songs-history"
          className="block w-max hover:bg-gray-200 hover:text-blue-950 my-6 mx-auto py-2 px-4 text-center border-2 border-solid border-gray-200 rounded-3xl !no-underline duration-500"
        >
          See history
        </Link>
    </section>
  );
}