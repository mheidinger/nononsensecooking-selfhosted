import { type Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { cache } from "react";
import { fetchSingleRecipe } from "~/server/recipes";
import DeletePage from "./DeletePage";

interface Props {
  params: Promise<{ id: string; locale: Locale }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const fetchRecipe = cache(fetchSingleRecipe);

export async function generateMetadata(props: Props) {
  const { locale } = await props.params;

  const t = await getTranslations({ locale, namespace: "common" });

  return {
    title: `${t("delete.pagetitle")} - NoNonsenseCooking`,
  };
}

async function getData(id: string) {
  const recipe = await fetchRecipe(id);

  return {
    recipe,
  };
}

export default async function Page(props: Props) {
  const { id } = await props.params;
  const data = await getData(id);

  return <DeletePage {...data} />;
}
