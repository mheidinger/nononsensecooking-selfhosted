import { default as Image, ImageProps } from "next/image";
import { useState } from "react";
import placeholderImg from "../public/img/placeholder.jpg";

type Props = Omit<ImageProps, "src"> & {
  s3Url: string | null;
};

const DishImage = (props: Props) => {
  const { s3Url, ...imageProps } = props;
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  return (
    <Image
      src={s3Url && !showPlaceholder ? s3Url : placeholderImg}
      onError={() => setShowPlaceholder(true)}
      fill
      style={{ objectFit: "cover" }}
      {...imageProps}
      alt={imageProps.alt} // Satisfy linter
    />
  );
};

export default DishImage;
