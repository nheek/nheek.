import dynamic from 'next/dynamic';
const FeaturedSongs = dynamic(() => import('./featured-songs'));
const Spotify = dynamic(() => import('./spotify'));
const MiniSpotify = dynamic(() => import('./mini-spotify'));

export default function Main() {
  return (
    <main>
        <FeaturedSongs />
        <Spotify />
        <MiniSpotify />
    </main>
  );
}