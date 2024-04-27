import Link from 'next/link';
import getTextsMap from '../get-texts-map';

export default function FeaturedSongs() {
  const spotify = [
    { 
      code:  `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/51ZQ1vr10ffzbwIjDCwqm4?utm_source=generator&theme=0" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`
    },
    {
      code: `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/6932XE7HnGtDvB0kgMDPdZ?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`
    },
    {
      code: `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/0VsihV5SdURpaVTrDmd8G3?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`
    },
    {
      code: `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/7HC7R2D8WjXVcUHJyEGjRs?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`
    },
    {
      code: `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/3uMO7jmdXxwSijvxNXDgE4?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`
    }
  ]

  const wwwNheekNo = {
    txtSpotify: 'utvalgte låter',
    links: spotify,
  };
  
  const wwwDefault = {
    txtSpotify: 'featured songs',
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
        <div className="flex flex-wrap gap-2 text-lg w-full md:w-[90%] mt-16 m-auto leading-8">
            {
              textsMap.links.map((spotifyItem, index) => (
                <div
                  key={index} 
                  className="w-full"
                >
                  <div dangerouslySetInnerHTML={{ __html: spotifyItem.code }} />
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