import { type Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { fetchRecipes, getRecipeTags } from "~/server/recipes";
import AllRecipesPage from "./AllRecipesPage";

interface Props {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata(props: Props) {
  const { locale } = await props.params;

  const t = await getTranslations({ locale, namespace: "common" });

  return {
    title: `${t("home.allrecipes")} - NoNonsenseCooking`,
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

  return <AllRecipesPage {...data} />;
}
