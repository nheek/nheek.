import Image from "next/image";

interface ImageLoaderProps {
  src: string;
  alt: string;
  className?: string; // className is optional
  width?: number; // width is optional
  height?: number; // height is optional
}

export default function ImageLoader({
  src,
  alt,
  className = "",
  width = 500,
  height = 500,
}: ImageLoaderProps) {
  return (
    <Image
      width={width}
      height={height}
      src={src}
      alt={alt}
      className={className}
      title={alt}
      loading="lazy" // Optional: Add lazy loading
    />
  );
}
