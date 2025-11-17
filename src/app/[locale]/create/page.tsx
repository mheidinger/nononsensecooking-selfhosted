import { type Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { getRecipeTags } from "~/server/recipes";
import CreatePage from "./CreatePage";

interface Props {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata(props: Props) {
  const { locale } = await props.params;

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
