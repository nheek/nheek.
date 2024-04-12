import ImageLoader from '../../components/utils/image-loader';

const images = [
  { src: "https://i.imgur.com/EWUtwBQ.png", alt: "picture of nheek"},
  { src: "https://i.imgur.com/d2AFjlV.jpeg", alt: "nheek holding his first painting"},
  { src: "https://i.imgur.com/5PEbiLz.jpeg", alt: "shes keeping the thumb"},
]

export default function Gallery() {
  return (
    <div className="flex flex-wrap justify-center md:gap-[5%] lg:gap-[3%] m-6">
      {
        images.map((image, index) => (
          <div key={"gallery"+index} className="md:w-[45%] lg:w-[30%] mt-8">
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