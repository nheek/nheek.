import ImageLoader from "../utils/ImageLoader";

const images = [
  {
    src: "https://uppy.nheek.com/uploads/5b3c7bc1-cfe1-4293-b447-2981a15544bf.png",
    alt: "taylor swift night club lezgooo",
  },
  { src: "https://uppy.nheek.com/uploads/7558a29e-56de-4c00-834f-b0c3bccdbf4b.png", alt: "cgi ducks based" },
  {
    src: "https://uppy.nheek.com/uploads/7321afea-c514-4aa8-b5b2-73d75e9f2f61.jpeg",
    alt: "that is not my trash trust me",
  },
  { src: "https://uppy.nheek.com/uploads/a6dbc99c-d2f1-4306-8e49-33972fb73dcb.jpeg", alt: "this coat hits different" },
  { src: "https://uppy.nheek.com/uploads/48087e9d-7e76-4cc5-9fa6-25e658286827.jpeg", alt: "kronstad and sit @ 2am" },
  { src: "https://uppy.nheek.com/uploads/95fafb7d-d554-47d5-9741-436a9112552f.jpeg", alt: "first time street tacos" },
  { src: "https://uppy.nheek.com/uploads/4c72d6d9-808e-4ecb-99d7-264d250c0995.png", alt: "so huge caaards" },
  { src: "https://uppy.nheek.com/uploads/afbba941-aa7f-4dd6-afe7-be91380efee2.jpeg", alt: "vintage car with a friend" },
  { src: "https://uppy.nheek.com/uploads/0673e6cb-1f5b-430b-bc9b-e429ac49921b.jpeg", alt: "vintage car me" },
  { src: "https://uppy.nheek.com/uploads/7033572e-e964-4044-b7c2-043dd2f8cddf.jpeg", alt: "2nd time climbing" },
  { src: "https://uppy.nheek.com/uploads/78dcee82-0c1e-4d62-aa98-26268c7060c0.jpeg", alt: "dinner is served" },
  { src: "https://uppy.nheek.com/uploads/613eeedf-a07e-4e30-8c90-93144a12bfdf.jpeg", alt: "sit on the road and smile" },
  { src: "https://uppy.nheek.com/uploads/a021b395-a2a7-4d15-ba60-742725a5dbb4.jpeg", alt: "met norwayrob!!!" },
  { src: "https://uppy.nheek.com/uploads/bc4a5620-09c0-4675-a750-d706c59e42b8.jpeg", alt: "sunset by the sea" },
  { src: "https://uppy.nheek.com/uploads/b6cf482b-645b-4121-8907-f5ca1e15f53a.jpeg", alt: "kronstad @ 4am" },
  { src: "https://uppy.nheek.com/uploads/d0261d84-70eb-4b29-9ed7-aed26d088b2a.png", alt: "cinematic foggy morning" },
  {
    src: "https://uppy.nheek.com/uploads/d2a40f9b-44f1-4837-baa1-4a3939cc46e6.png",
    alt: "subic international airport",
  },
  { src: "https://uppy.nheek.com/uploads/ead75e68-79b7-4fc1-8f2a-7778a91c6ac1.jpeg", alt: "at subic bay" },
  { src: "https://uppy.nheek.com/uploads/2b56d1aa-2993-462c-a24f-25e59fea613c.jpeg", alt: "at an aviation school" },
  {
    src: "https://uppy.nheek.com/uploads/82d34d52-7fad-4b22-b4e6-e88e18a767bc.jpeg",
    alt: "riding a horse in my home city",
  },
  {
    src: "https://uppy.nheek.com/uploads/1375cad3-431f-4b93-a9aa-ea21d9e3a070.jpeg",
    alt: "coconut farm near my hometown",
  },
  { src: "https://uppy.nheek.com/uploads/f9dcb669-32e0-43a3-ae46-27624a87bc2f.jpg", alt: "a friend's car" },
  { src: "https://uppy.nheek.com/uploads/9f1057f6-e9f8-4811-8e5f-b895e13bc866.jpeg", alt: "17th of may" },
  { src: "https://uppy.nheek.com/uploads/e717a9bb-5694-4b19-8a2f-10f30a149700.png", alt: "picture of me" },
  {
    src: "https://uppy.nheek.com/uploads/c473d7c3-2e46-4002-b736-58d9931eeff6.jpeg",
    alt: "me holding my arguably first painting",
  },
];

export default function Gallery() {
  return (
    <div className="m-2 md:m-6 mt-6 leading-[0] columns-2 md:columns-3 gap-x-1">
      {images.map((image, index) => (
        <div key={"gallery" + index} className="w-full h-auto mb-1">
          <ImageLoader src={image.src} alt={image.alt} className="rounded-xl" />
        </div>
      ))}
    </div>
  );
}
