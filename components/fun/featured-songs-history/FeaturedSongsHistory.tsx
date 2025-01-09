// import getTextsMap from "../../utils/GetTextsMap";

export default function FeaturedSongsHistory() {
  const spotify = [
    {
      title: "28 april 2024",
      collection: [
        {
          code: `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/5og4Qzt92jJzVDkOtSEilb?utm_source=generator" width="100%" height="100" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`,
        },
        {
          code: `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/7Mts0OfPorF4iwOomvfqn1?utm_source=generator" width="100%" height="100" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`,
        },
        {
          code: `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/0W0iAC1VGlB82PI6elxFYf?utm_source=generator" width="100%" height="100" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`,
        },
        {
          code: `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/2OzhQlSqBEmt7hmkYxfT6m?utm_source=generator" width="100%" height="100" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`,
        },
        {
          code: `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/2F3N9tdombb64aW6VtZOdo?utm_source=generator" width="100%" height="100" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`,
        },
      ],
    },
    {
      title: "march 2024",
      collection: [
        {
          code: `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/51ZQ1vr10ffzbwIjDCwqm4?utm_source=generator" width="100%" height="100" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`,
        },
        {
          code: `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/6932XE7HnGtDvB0kgMDPdZ?utm_source=generator" width="100%" height="100" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`,
        },
        {
          code: `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/0VsihV5SdURpaVTrDmd8G3?utm_source=generator" width="100%" height="100" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`,
        },
        {
          code: `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/7HC7R2D8WjXVcUHJyEGjRs?utm_source=generator" width="100%" height="100" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`,
        },
        {
          code: `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/3uMO7jmdXxwSijvxNXDgE4?utm_source=generator" width="100%" height="100" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`,
        },
      ],
    },
  ];

  return (
    <div className="w-[80%] mt-12 md:mt-20 mx-auto">
      <h2 className="text-4xl md:text-[4rem] xl:text-[8rem]">
        featured songs history
      </h2>
      <div className="flex flex-wrap justify-center gap-14 text-lg w-full md:w-[90%] mt-8 md:mt-16 m-auto leading-8">
        {spotify.map((spotifyItem, index) => (
          <div key={"spotify-item-" + index} className="md:w-[45%]">
            <div>{spotifyItem.title}</div>
            <div className="flex flex-col items-center">
              {spotifyItem.collection.map((spotify, index) => (
                <div
                  key={"spotify-" + index}
                  className="w-full h-[90px]"
                  dangerouslySetInnerHTML={{ __html: spotify.code }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
