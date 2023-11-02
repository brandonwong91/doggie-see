import React from "react";
import { useEffect, useState } from "react";
import Image from "next/image";

interface FallbackImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
}

const FallbackImage: React.FC<FallbackImageProps> = ({
  src,
  alt,
  width,
  height,
}) => {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <Image
      src={imgSrc ? imgSrc : "/puppy-not-found.jpg"}
      alt={alt}
      width={width}
      height={imgSrc ? height : 10}
      onError={() => {
        setImgSrc("/puppy-not-found.jpg");
      }}
      className="rounded-t-lg"
    />
  );
};

export default FallbackImage;
