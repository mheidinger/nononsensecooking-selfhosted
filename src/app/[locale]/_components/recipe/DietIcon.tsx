import {
  mdiAlphaVCircleOutline,
  mdiFish,
  mdiFoodSteak,
  mdiHelpCircleOutline,
  mdiLeaf,
} from "@mdi/js";
import Icon from "@mdi/react";
import {useTranslations} from "next-intl";
import React from "react";
import {Diet} from "~/models/Diet";

interface Props {
	id?: string;
	diet: Diet;
	size?: number;
}

export default function IconForDiet({
  id,
  diet,
  size = 1,
}: Props) {
  const t = useTranslations("common");
  switch (diet) {
    case Diet.enum.meat:
      return (
        <Icon
          id={id}
          path={mdiFoodSteak}
          title={t(`diet.${diet}`)}
          size={size}
        />
      );
    case Diet.enum.fish:
      return (
        <Icon id={id} path={mdiFish} title={t(`diet.${diet}`)} size={size} />
      );
    case Diet.enum.vegan:
      return (
        <Icon
          id={id}
          path={mdiAlphaVCircleOutline}
          title={t(`diet.${diet}`)}
          size={size}
        />
      );
    case Diet.enum.vegetarian:
      return (
        <Icon id={id} path={mdiLeaf} title={t(`diet.${diet}`)} size={size} />
      );
    default:
      return (
        <Icon
          id={id}
          path={mdiHelpCircleOutline}
          title="UNKNOWN DIET"
          size={size}
        />
      );
  }
};
