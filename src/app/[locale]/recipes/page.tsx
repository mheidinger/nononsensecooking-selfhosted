import { getTranslations } from "next-intl/server";
import { fetchRecipes, getRecipeTags } from "~/server/recipes";
import Recipes from "./Recipes";

interface Props {
  params: { locale: string };
}

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: "common" });

  return {
    title: t("home.allrecipes"),
  };
}

async function getData() {
  const recipes = await fetchRecipes();
  const availableTags = await getRecipeTags();

  return {
    recipes,
    availableTags,
  };
}

export default async function Page() {
  const data = await getData();

  return <Recipes {...data} />;
}
