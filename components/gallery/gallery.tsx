import ImageLoader from '../utils/ImageLoader';

const images = [
  { src: "https://i.imgur.com/8fwLAsa.jpeg", alt: "at subic bay"},
  { src: "https://i.imgur.com/ceBR7M6.jpeg", alt: "at an aviation school"},
  { src: "https://i.imgur.com/ABDdjqt.jpeg", alt: "riding a horse in my home city"},
  { src: "https://i.imgur.com/ZJ69C5S.jpeg", alt: "coconut farm near my hometown"},
  { src: "https://i.imgur.com/MxvDq29.jpg", alt: "a friend's car"},
  { src: "https://i.imgur.com/BvJjU8V.jpeg", alt: "17th of may"},
  { src: "https://i.imgur.com/EWUtwBQ.png", alt: "picture of me"},
  { src: "https://i.imgur.com/d2AFjlV.jpeg", alt: "me holding my arguably first painting"},
]

export default function Gallery() {
  return (
    <div className="m-2 md:m-6 mt-6 leading-[0] columns-2 md:columns-3 gap-x-1">
      {
        images.map((image, index) => (
          <div key={"gallery"+index} className="w-full h-auto mb-1 md:mb-2">
            <ImageLoader
              src={image.src}
              alt={image.alt}
              className="rounded-xl"
            />
          </div>
        ))
      }
    </div>
  );
}