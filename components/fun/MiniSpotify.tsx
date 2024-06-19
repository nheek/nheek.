import DOMPurify from 'dompurify';
import getTextsMap from '../GetTextsMap';

export default function MiniSpotify() {
  const mini_spotify = [
    {
      name: 'easter playlist',
      code:  `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/14afZbypSYEC10CXa3OhD2?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`
    },
  ]

  const mini_spotify_no = [
    {
      name: 'påske spilleliste',
      code:  `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/14afZbypSYEC10CXa3OhD2?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`
    },
  ]

  const wwwNheekNo = {
    txtSpotify: 'mini spillelister',
    links: mini_spotify_no,
  };

  const wwwDefault = {
    txtSpotify: 'mini playlists',
    links: mini_spotify,
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
        <div className="flex flex-wrap gap-8 text-lg w-full md:w-[90%] mt-16 m-auto leading-8">
            {
              textsMap.links.map((spotifyItem, index) => (
                <div
                  key={"spotify-item-" + index}
                  className="w-full"
                >
                  <h2>{spotifyItem.name}</h2>
                  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(spotifyItem.code) }} />
                </div>
              ))
            }
        </div>
    </section>
  );
}