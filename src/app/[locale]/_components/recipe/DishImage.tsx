"use client";

import { default as Image, type ImageProps } from "next/image";
import { useState } from "react";
import placeholderImage from "./placeholder.jpg";

type Props = Omit<ImageProps, "src"> & {
  imageUrl: string | null;
};

export default function DishImage({ imageUrl, ...imageProps }: Props) {
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  return (
    <Image
      src={imageUrl && !showPlaceholder ? imageUrl : placeholderImage}
      onError={() => setShowPlaceholder(true)}
      fill
      style={{ objectFit: "cover" }}
      {...imageProps}
      alt={imageProps.alt}
    />
  );
}
