import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import FooterHero from "../../components/FooterHero";
import Navigate from "../../components/Navigate";
import ThemeWrapper from "../../components/ThemeWrapper";

export const metadata = {
  title: "Music",
  description:
    "explore nheek's music albums and songs. songwriter crafting lyrics that breathe life into emotions.",
  openGraph: {
    title: "Music | nheek",
    description:
      "explore nheek's music albums and songs. songwriter crafting lyrics that breathe life into emotions.",
    images: [
      {
        url: "https://flies.nheek.com/uploads/nheek/pfp/pfp",
        width: 1200,
        height: 1200,
        alt: "nheek music",
      },
    ],
  },
};

type Album = {
  id: number;
  codename: string;
  title: string;
  featured?: boolean;
  coverImage: string;
  releaseDate: string;
  songs: { id: number; codename: string; title: string; duration: string }[];
};

async function getAlbums(): Promise<{
  featured: Album[];
  regular: Album[];
}> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    const response = await fetch(`${baseUrl}/api/albums`, {
      next: { tags: ["albums"] }, // Tag for on-demand revalidation
    });

    if (!response.ok) {
      console.error("Failed to fetch albums:", response.statusText);
      return { featured: [], regular: [] };
    }

    const data = await response.json();
    const apiAlbums = data.albums || [];

    // Transform API data to match component format
    const allAlbums = apiAlbums.map((album: any) => ({
      id: album.id,
      codename: album.codename,
      title: album.title,
      featured: album.featured === 1,
      coverImage: album.cover_image_url || "",
      releaseDate: album.release_date,
      songs: album.songs || [],
    }));

    // Sort albums by release date (newest first)
    const sortedAlbums = [...allAlbums].sort((a: Album, b: Album) => {
      const dateA = new Date(a.releaseDate);
      const dateB = new Date(b.releaseDate);
      return dateB.getTime() - dateA.getTime();
    });

    // Separate featured and regular albums
    const featured = sortedAlbums.filter((album: Album) => album.featured);
    const regular = sortedAlbums.filter((album: Album) => !album.featured);

    return { featured, regular };
  } catch (error) {
    console.error("Error fetching albums:", error);
    return { featured: [], regular: [] };
  }
}

export default async function MusicPage() {
  const { featured: featuredAlbums, regular: regularAlbums } =
    await getAlbums();
  const musicThemeColor = "#c45a74"; // Pink/rose color for music

  return (
    <ThemeWrapper themeColor={musicThemeColor}>
      <div className="min-h-screen bg-[#2d0a1f]">
        <Header currentPage="music" />

        {/* Main Content */}
        <main>
          <div className="w-[85%] mx-auto mt-6 mb-20">
            <h2 className="text-2xl md:text-[3rem] xl:text-[4rem] text-center mt-40 mb-8">
              featured music
            </h2>

            {/* Featured Albums Section */}
            {featuredAlbums.length > 0 && (
              <div className="mb-16">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="h-px bg-[#a0475e] w-20"></div>
                  <h3 className="text-xl md:text-2xl text-[#c45a74] font-semibold">
                    Featured Albums
                  </h3>
                  <div className="h-px bg-[#a0475e] w-20"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredAlbums.map((album) => {
                    return (
                      <Link
                        key={album.id}
                        href={`/music/${album.codename}`}
                        className="group cursor-pointer"
                      >
                        <div className="relative rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all ring-2 ring-[#a0475e]">
                          <div className="absolute top-2 right-2 z-10 bg-[#8a3952] text-white text-xs font-bold px-3 py-1 rounded-full">
                            FEATURED
                          </div>
                          <img
                            src={album.coverImage}
                            alt={album.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute w-full p-4 bottom-0 bg-gradient-to-t from-black to-transparent">
                            <h3 className="w-[70%] wrap-break-word text-2xl font-semibold text-white group-hover:text-[#c45a74] transition-colors">
                              {album.title}
                            </h3>
                            <p className="text-sm text-gray-500 absolute right-0 bottom-0 p-4">
                              {album.songs.length} tracks
                            </p>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Regular Albums Section */}
            {regularAlbums.length > 0 && (
              <div>
                {featuredAlbums.length > 0 && (
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="h-px bg-gray-600 w-20"></div>
                    <h3 className="text-xl md:text-2xl text-gray-400 font-semibold">
                      All Albums
                    </h3>
                    <div className="h-px bg-gray-600 w-20"></div>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularAlbums.map((album) => {
                    return (
                      <Link
                        key={album.id}
                        href={`/music/${album.codename}`}
                        className="group cursor-pointer"
                      >
                        <div className="relative rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all">
                          <img
                            src={album.coverImage}
                            alt={album.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute w-full p-4 bottom-0 bg-gradient-to-t from-black to-transparent">
                            <h3 className="w-[70%] wrap-break-word text-2xl font-semibold text-white group-hover:text-[#c45a74] transition-colors">
                              {album.title}
                            </h3>
                            <p className="text-sm text-gray-500 absolute right-0 bottom-0 p-4">
                              {album.songs.length} tracks
                            </p>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="text-center mt-10">
              <p className="text-gray-400">
                Click on an album to view the tracklist and lyrics
              </p>
              <p className="text-gray-400/60 italic">AI-assisted production</p>
            </div>
          </div>
          <FooterHero />
          <Navigate themeColor="#8a3952" />
        </main>
        <Footer themeColor="#c45a74" />
      </div>
    </ThemeWrapper>
  );
}
