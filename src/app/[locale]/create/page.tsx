import { getTranslations } from "next-intl/server";
import { getRecipeTags } from "~/server/recipes";
import CreatePage from "./CreatePage";

interface Props {
  params: { locale: string };
}

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: "common" });

  return {
    title: `${t("create.pagetitle")} - NoNonsenseCooking`,
  };
}

async function getData() {
  const availableTags = await getRecipeTags();

  return {
    availableTags,
  };
}

export default async function Page() {
  const data = await getData();

  return <CreatePage {...data} />;
}
