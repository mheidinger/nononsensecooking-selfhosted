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
  ingredients: [{name: "", amount: null}],
  steps: [""]
};

export default function CreateRecipe({}: InferGetStaticPropsType<
  typeof getStaticProps
>) {
  const { t } = useTranslation("common");
  const [ recipe, setRecipe ] = useState(initRecipe);

  function saveRecipe() {
    console.log("Save ", recipe);
  }

  return (
    <>
      <PageTitle title={t("create.pagetitle")} />
      <EditRecipe
        title={t("create.displaytitle")}
        recipe={recipe}
        setRecipe={setRecipe}
        saveRecipe={saveRecipe}
      />
    </>
  );
}
