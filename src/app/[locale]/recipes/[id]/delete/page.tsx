import { getTranslations } from "next-intl/server";
import { cache } from "react";
import { fetchSingleRecipe } from "~/server/recipes";
import DeletePage from "./DeletePage";

interface Props {
  params: { id: string; locale: string };
  searchParams: Record<string, string | string[] | undefined>;
}

const fetchRecipe = cache(fetchSingleRecipe);

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: "common" });

  return {
    title: `${t("delete.pagetitle")} - NoNonsenseCooking`,
  };
}

async function getData({ params }: Props) {
  const recipe = await fetchRecipe(params.id);

  return {
    recipe,
  };
}

export default async function Page(props: Props) {
  const data = await getData(props);

  return <DeletePage {...data} />;
}
