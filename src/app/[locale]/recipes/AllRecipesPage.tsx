import { useTranslations } from "next-intl";
import { type Recipe } from "~/models/Recipe";
import PaddedSection from "~components/layout/PaddedSection";
import DishList from "~components/recipe/DishList";

interface Props {
  recipes: Recipe[];
  availableTags: string[];
}

export default function AllRecipesPage({ recipes, availableTags }: Props) {
  const t = useTranslations("common");

  return (
    <>
      <PaddedSection title={t("home.allrecipes")} smallHeadings>
        <DishList recipes={recipes} availableTags={availableTags} />
      </PaddedSection>
    </>
  );
}
