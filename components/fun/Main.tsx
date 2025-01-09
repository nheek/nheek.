import dynamic from "next/dynamic";
const FeaturedSongs = dynamic(() => import("./FeaturedSongs"));
// const Spotify = dynamic(() => import("./Spotify"));
// const MiniSpotify = dynamic(() => import("./MiniSpotify"));

export default function Main() {
  return (
    <main>
      <FeaturedSongs />
      {/* <Spotify /> */}
      {/* <MiniSpotify /> */}
    </main>
  );
}
