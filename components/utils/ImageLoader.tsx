import Image from "next/image";

interface ImageLoaderProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ImageLoader({
  src,
  alt,
  className = "",
}: ImageLoaderProps) {
  return (
    <div className="relative h-full">
      <Image
        src={src}
        alt={alt}
        className={`${className} !relative object-contain`}
        title={alt}
        fill
        // loading="lazy"
      />
    </div>
  );
}
