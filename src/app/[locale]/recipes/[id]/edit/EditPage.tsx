import { useTranslations } from "next-intl";
import { type Recipe } from "~/models/Recipe";
import EditRecipe from "../../../_components/edit/EditRecipe";

interface Props {
  recipe: Recipe;
  availableTags: string[];
}

export default function CreatePage({ recipe, availableTags }: Props) {
  const t = useTranslations("common");

  return (
    <EditRecipe
      title={t("edit.displaytitle")}
      initialRecipe={recipe}
      availableTags={availableTags}
    />
  );
}
