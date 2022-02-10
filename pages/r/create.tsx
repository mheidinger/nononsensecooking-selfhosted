import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import PageTitle from "../../components/PageTitle";
import { Diet, Recipe } from "../../models/Recipe";
import EditRecipe from "../../components/edit/EditRecipe";
import { useState } from "react";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "header", "footer", "recipe"])),
    },
  };
};

const initRecipe: Recipe = {
  id: "",
  name: "New Recipe",
  diet: Diet.Meat,
  cookTime: 20,
  publishedAt: "",
  ingredients: [{name: ""}],
  steps: [""]
};

export default function CreateRecipe({}: InferGetStaticPropsType<
  typeof getStaticProps
>) {
  const { t } = useTranslation("common");
  const [ recipe, setRecipe ] = useState(initRecipe);

  return (
    <>
      <PageTitle title={t("create.pagetitle")} />
      <EditRecipe
        recipe={recipe}
        setRecipe={setRecipe}
      />
    </>
  );
}
