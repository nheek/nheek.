export default function Gallery() {
  return (
    <div className="flex flex-wrap justify-center md:gap-[5%] lg:gap-[3%] m-6">
      <div className="md:w-[45%] lg:w-[30%] mt-8">
        <img src="https://i.imgur.com/EWUtwBQ.png" alt="shes keeping the thumb" />
      </div>
      <div className="md:w-[45%] lg:w-[30%] mt-8">
        <img src="https://i.imgur.com/5PEbiLz.jpeg" alt="shes keeping the thumb" />
      </div>
    </div>
  );
}