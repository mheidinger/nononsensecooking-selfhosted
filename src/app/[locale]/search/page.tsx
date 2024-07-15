import { getTranslations } from "next-intl/server";
import { searchRecipes } from "~/actions";
import { getRecipeTags } from "~/server/recipes";
import SearchPage from "./SearchPage";

interface Props {
  params: { locale: string };
  searchParams: Record<string, string | string[] | undefined>;
}

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: "common" });

  return {
    title: t("search.pagetitle"),
  };
}

async function getData({ query }: Props["searchParams"]) {
  const searchTerm =
    Array.isArray(query) && query.length > 0
      ? query[0]
      : typeof query === "string"
        ? query
        : undefined;

  if (!searchTerm) {
    return {
      searchTerm: "",
      results: [],
      availableTags: [],
    };
  }

  const results = await searchRecipes(searchTerm);
  const availableTags = await getRecipeTags();

  return {
    searchTerm,
    results,
    availableTags,
  };
}

export default async function Page({ searchParams }: Props) {
  const data = await getData(searchParams);

  return <SearchPage {...data} />;
}
