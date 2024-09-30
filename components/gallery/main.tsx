import dynamic from "next/dynamic";
const Gallery = dynamic(() => import("./gallery"));

export default function Main() {
  return (
    <main>
      <Gallery />
    </main>
  );
}
