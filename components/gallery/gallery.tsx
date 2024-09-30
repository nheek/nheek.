import ImageLoader from "../utils/ImageLoader";

const images = [
  {
    src: "https://i.imgur.com/E9TNwuK.png",
    alt: "taylor swift night club lezgooo",
  },
  { src: "https://i.imgur.com/QXoIOl7.png", alt: "cgi ducks based" },
  {
    src: "https://i.imgur.com/ThSuFiB.jpeg",
    alt: "that is not my trash trust me",
  },
  { src: "https://i.imgur.com/u7ZtkEg.jpeg", alt: "this coat hits different" },
  { src: "https://i.imgur.com/t8vrzk3.jpeg", alt: "kronstad and sit @ 2am" },
  { src: "https://i.imgur.com/5tY1gRg.jpeg", alt: "first time street tacos" },
  { src: "https://i.imgur.com/vjX4FuH.png", alt: "so huge caaards" },
  { src: "https://i.imgur.com/igWEt43.jpeg", alt: "vintage car with a friend" },
  { src: "https://i.imgur.com/fXnoggX.jpeg", alt: "vintage car me" },
  { src: "https://i.imgur.com/OEcVjJr.jpeg", alt: "2nd time climbing" },
  { src: "https://i.imgur.com/DM3uKIQ.jpeg", alt: "dinner is served" },
  { src: "https://i.imgur.com/aWzYQO8.jpeg", alt: "sit on the road and smile" },
  { src: "https://i.imgur.com/jCe79ie.jpeg", alt: "met norwayrob!!!" },
  { src: "https://i.imgur.com/UQN5Msc.jpeg", alt: "sunset by the sea" },
  { src: "https://i.imgur.com/ub1iv7w.jpeg", alt: "kronstad @ 4am" },
  { src: "https://i.imgur.com/BRCVsTd.png", alt: "cinematic foggy morning" },
  {
    src: "https://i.imgur.com/I58fmwP.png",
    alt: "subic international airport",
  },
  { src: "https://i.imgur.com/8fwLAsa.jpeg", alt: "at subic bay" },
  { src: "https://i.imgur.com/ceBR7M6.jpeg", alt: "at an aviation school" },
  {
    src: "https://i.imgur.com/ABDdjqt.jpeg",
    alt: "riding a horse in my home city",
  },
  {
    src: "https://i.imgur.com/ZJ69C5S.jpeg",
    alt: "coconut farm near my hometown",
  },
  { src: "https://i.imgur.com/MxvDq29.jpg", alt: "a friend's car" },
  { src: "https://i.imgur.com/BvJjU8V.jpeg", alt: "17th of may" },
  { src: "https://i.imgur.com/EWUtwBQ.png", alt: "picture of me" },
  {
    src: "https://i.imgur.com/d2AFjlV.jpeg",
    alt: "me holding my arguably first painting",
  },
];

export default function Gallery() {
  return (
    <div className="m-2 md:m-6 mt-6 leading-[0] columns-2 md:columns-3 gap-x-1">
      {images.map((image, index) => (
        <div key={"gallery" + index} className="w-full h-auto mb-1 md:mb-2">
          <ImageLoader src={image.src} alt={image.alt} className="rounded-xl" />
        </div>
      ))}
    </div>
  );
}
