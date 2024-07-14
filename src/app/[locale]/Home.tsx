import { useTranslations } from "next-intl";
import { type Recipe } from "~/models/Recipe";
import PaddedSection from "./_components/layout/PaddedSection";
import Track from "./_components/layout/Track";
import DishCard from "./_components/recipe/DishCard";

interface Props {
  recipesOfTheDay: Recipe[];
  latestRecipes: Recipe[];
}

export default function Home({ recipesOfTheDay, latestRecipes }: Props) {
  const t = useTranslations("common");

  return (
    <>
      <PaddedSection title={t("home.todaysrecipes")} smallHeadings>
        <Track sm={1} md={2} lg={3}>
          {recipesOfTheDay.map((recipe) => (
            <DishCard recipe={recipe} key={recipe.id} />
          ))}
        </Track>
      </PaddedSection>
      <PaddedSection title={t("home.latestrecipes")} smallHeadings>
        <Track sm={1} md={2} lg={3}>
          {latestRecipes.map((recipe) => (
            <DishCard recipe={recipe} key={recipe.id} />
          ))}
        </Track>
      </PaddedSection>
    </>
  );
}
