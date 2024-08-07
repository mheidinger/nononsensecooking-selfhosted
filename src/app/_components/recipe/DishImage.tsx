"use client";

import { useTranslations } from "next-intl";
import { default as Image, type ImageProps } from "next/image";
import { useState } from "react";
import placeholderImage from "./placeholder.jpg";

type Props = Omit<ImageProps, "src" | "alt"> & {
  dishName: string;
  imageUrl: string | null;
};

export default function DishImage({
  imageUrl,
  dishName,
  ...imageProps
}: Props) {
  const t = useTranslations("recipe");
  const [didError, setDidError] = useState(false);

  const showPlaceholder = !imageUrl || didError;

  return (
    <Image
      src={showPlaceholder ? placeholderImage : imageUrl}
      onError={() => setDidError(true)}
      fill
      style={{ objectFit: "cover" }}
      alt={
        showPlaceholder
          ? t("imagePlaceholderAlt", { name: dishName })
          : t("imageAlt", { name: dishName })
      }
      {...imageProps}
    />
  );
}
