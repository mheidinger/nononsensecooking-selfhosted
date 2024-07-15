import { getTranslations } from "next-intl/server";
import { fetchSingleRecipe, getRecipeTags } from "~/server/recipes";
import EditPage from "./EditPage";

interface Props {
  params: { id: string; locale: string };
}

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: "common" });

  return {
    title: `${t("edit.pagetitle")} - NoNonsenseCooking`,
  };
}

async function getData({ params }: Props) {
  const { id } = params;
  const recipe = await fetchSingleRecipe(id);
  const availableTags = await getRecipeTags();

  return {
    recipe,
    availableTags,
  };
}

export default async function Page(props: Props) {
  const data = await getData(props);

  return <EditPage {...data} />;
}
