import Image from "next/image";

function imageLoaderHere({ src, width, quality }) {
    return `${src}?w=${width}&q=${quality}`;
}

export default function ImageLoader({ src, alt, className="", width=null, quality=100 }) {
  return (
    <Image
      loader={imageLoaderHere.bind(null, { src, width, quality })}
      src={src}
      alt={alt}
      placeholder="blur"
      className={className}
      title={alt}
    />
  );
}