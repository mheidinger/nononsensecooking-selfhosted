"use client";

import { useTranslations } from "next-intl";
import EditRecipe from "~components/edit/EditRecipe";

interface Props {
  availableTags: string[];
}

export default function CreatePage({ availableTags }: Props) {
  const t = useTranslations("common");

  return (
    <EditRecipe
      title={t("create.displaytitle")}
      availableTags={availableTags}
    />
  );
}
