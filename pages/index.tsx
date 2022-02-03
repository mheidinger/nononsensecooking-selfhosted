import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import DishCard from "../components/DishCard";
import { PaddedSection } from "../components/PaddedSection";
import PageTitle from "../components/PageTitle";
import Track from "../components/Track";
import { fetchRecipeIndex } from "../lib/recipes";
import { Recipe, RecipeInIndex } from "../models/Recipe";

function shuffle(a: any[]) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const allRecipes = await fetchRecipeIndex();
  // TODO: Cache this and refresh every day
  const recipesOfTheDay = shuffle(allRecipes)
    .slice(0, 3);
  const latestRecipes = allRecipes.sort(byPublishedAt).slice(0, 3);

  return {
    props: {
      ...(await serverSideTranslations(context.locale, ["common", "footer", "header"])),
      recipesOfTheDay,
      latestRecipes,
    }
  };
};

export default function Home({
  recipesOfTheDay,
  latestRecipes,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { t } = useTranslation("common");
  return (
    <>
      <PageTitle />
      <PaddedSection title={t("home.todaysrecipes")} smallHeadings>
        <Track sm={1} md={2} lg={3}>
          {recipesOfTheDay.map((recipe: RecipeInIndex) => (
            <DishCard {...recipe} key={recipe.id} />
          ))}
        </Track>
      </PaddedSection>
      <PaddedSection title={t("home.latestrecipes")} smallHeadings>
        <Track sm={1} md={2} lg={3}>
          {latestRecipes.map((recipe: RecipeInIndex) => (
            <DishCard {...recipe} key={recipe.id} />
          ))}
        </Track>
      </PaddedSection>
    </>
  );
}

function byPublishedAt(a: Pick<Recipe, "publishedAt">, b: Pick<Recipe, "publishedAt">) {
  return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
}
