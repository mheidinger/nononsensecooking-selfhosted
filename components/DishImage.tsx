import { default as Image, ImageProps } from "next/image";
import { useState } from "react";
import placeholderImg from "../public/img/placeholder.jpg";

type Props = Omit<ImageProps, "src"> & {
  imageUrl: string | null;
};

const DishImage = (props: Props) => {
  const { imageUrl , ...imageProps } = props;
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  return (
    <Image
      src={imageUrl && !showPlaceholder ? imageUrl : placeholderImg}
      onError={() => setShowPlaceholder(true)}
      fill
      style={{ objectFit: "cover" }}
      {...imageProps}
      alt={imageProps.alt} // Satisfy linter
    />
  );
};

export default DishImage;
