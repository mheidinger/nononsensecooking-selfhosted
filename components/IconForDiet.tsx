import {
  mdiAlphaVCircleOutline,
  mdiFish,
  mdiFoodSteak,
  mdiHelpCircleOutline,
  mdiLeaf,
} from "@mdi/js";
import Icon from "@mdi/react";
import { useTranslation } from "next-i18next";
import React from "react";
import { Recipe } from "../models/Recipe";

const IconForDiet = ({
  id,
  diet,
  size = 1,
}: {
  id?: string;
  diet: Recipe["diet"];
  size?: number;
}) => {
  const { t } = useTranslation();
  switch (diet) {
    case "meat":
      return <Icon id={id} path={mdiFoodSteak} title={t(`diet.${diet}`)} size={size} />;
    case "fish":
      return <Icon id={id} path={mdiFish} title={t(`diet.${diet}`)} size={size} />;
    case "vegan":
      return (
        <Icon
          id={id}
          path={mdiAlphaVCircleOutline}
          title={t(`diet.${diet}`)}
          size={size}
        />
      );
    case "vegetarian":
      return <Icon id={id} path={mdiLeaf} title={t(`diet.${diet}`)} size={size} />;
    default:
      return (
        <Icon id={id} path={mdiHelpCircleOutline} title="UNKNOWN DIET" size={size} />
      );
  }
};

function getRandomId(): string {
  return Math.random().toString(16).slice(2);
}

export default IconForDiet;
