import { default as Image, ImageProps } from "next/image";
import { useState } from "react";

type Props = Omit<ImageProps, "src"> & {
  s3Url?: string;
};

const DishImage = (props: Props) => {
  const { s3Url, ...imageProps } = props;
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  let src = "/img/placeholder.jpg";
  if (s3Url && s3Url !== "" && !showPlaceholder) {
    src = s3Url;
  }

  return (
    <Image
      src={src}
      onError={() => setShowPlaceholder(true)}
      fill
      style={{ objectFit: "cover" }}
      {...imageProps}
      alt={imageProps.alt} // Satisfy linter
    />
  );
};

export default DishImage;
