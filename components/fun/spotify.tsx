import getTextsMap from '../get-texts-map';

export default function Spotify() {
  const spotify = [
    { 
      name: 'january playlist',
      code:  `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/5QWB21vBaWlsTih67FcgFU?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`
    },
    { 
      name: 'february playlist',
      code:  `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/3A4N3LuUmL3ZSKXLDlwu5D?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`
    },
    { 
      name: 'march playlist',
      code:  `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/10A91swxxdfEXvRHcXtGce?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`
    }
  ]

  const spotify_no = [
    { 
      name: 'januar spilleliste',
      code:  `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/5QWB21vBaWlsTih67FcgFU?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`
    },
    { 
      name: 'februar spilleliste',
      code:  `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/3A4N3LuUmL3ZSKXLDlwu5D?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`
    },
    { 
      name: 'mars spilleliste',
      code:  `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/10A91swxxdfEXvRHcXtGce?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`
    }
  ]

  const wwwNheekNo = {
    txtSpotify: 'spotify spillelister',
    links: spotify_no,
  };
  
  const wwwDefault = {
    txtSpotify: 'spotify playlists',
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
        <div className="flex flex-wrap gap-8 text-lg w-full md:w-[90%] mt-16 m-auto leading-8">
            {
              textsMap.links.map((spotifyItem, index) => (
                <div
                  key={index} 
                  className="w-full"
                >
                  <h2>{spotifyItem.name}</h2>
                  <div dangerouslySetInnerHTML={{ __html: spotifyItem.code }} />
                </div>
              ))
            }
        </div>
    </section>
  );
}