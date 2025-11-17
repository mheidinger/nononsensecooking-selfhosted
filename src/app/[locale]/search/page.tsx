import { type Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { getRecipeTags, searchRecipes } from "~/server/recipes";
import SearchPage from "./SearchPage";

interface Props {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata(props: Props) {
  const { locale } = await props.params;

  const t = await getTranslations({ locale, namespace: "common" });

  return {
    title: `${t("search.pagetitle")} - NoNonsenseCooking`,
  };
}

async function getData(query: string | string[] | undefined) {
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

export default async function Page(props: Props) {
  const { query } = await props.searchParams;
  const data = await getData(query);

  return <SearchPage {...data} />;
}
