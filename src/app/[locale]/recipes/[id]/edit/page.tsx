import { type Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { fetchSingleRecipe, getRecipeTags } from "~/server/recipes";
import EditPage from "./EditPage";

interface Props {
  params: Promise<{ id: string; locale: Locale }>;
}

export async function generateMetadata(props: Props) {
  const { locale } = await props.params;

  const t = await getTranslations({ locale, namespace: "common" });

  return {
    title: `${t("edit.pagetitle")} - NoNonsenseCooking`,
  };
}

async function getData(id: string) {
  const recipe = await fetchSingleRecipe(id);
  const availableTags = await getRecipeTags();

  return {
    recipe,
    availableTags,
  };
}

export default async function Page(props: Props) {
  const { id } = await props.params;
  const data = await getData(id);

  return <EditPage {...data} />;
}
