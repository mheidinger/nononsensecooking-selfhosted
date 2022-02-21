import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import DishList from "../components/DishList";
import { PaddedSection } from "../components/PaddedSection";
import PageTitle from "../components/PageTitle";
import { fetchRecipeIndex } from "../lib/recipes";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const recipeIndex = await fetchRecipeIndex();
  const lang = context.locale ? context.locale : "en-US";

  return {
    props: {
      ...(await serverSideTranslations(lang, [
        "common",
        "footer",
        "header",
      ])),
      recipes: recipeIndex,
    },
  };
};

export default function Recipes({
  recipes,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { t } = useTranslation("common");

  return (
    <>
      <PageTitle title={t("home.allrecipes")} />
      <PaddedSection title={t("home.allrecipes")} smallHeadings>
      <DishList recipes={recipes} />
      </PaddedSection>
    </>
  );
}
