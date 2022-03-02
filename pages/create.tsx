import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import PageTitle from "../components/PageTitle";
import { Diet, Recipe } from "../models/Recipe";
import EditRecipe from "../components/edit/EditRecipe";
import { useEffect, useState } from "react";
import { Unit } from "../models/Unit";
import { useRouter } from "next/router";
import { uploadImage, uploadRecipe } from "../lib/client/upload";
import ErrorNotification from "../components/edit/ErrorNotification";
import { getRecipeTags } from "../lib/recipes";

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const initRecipe: Recipe = {
    id: "",
    name: "New Recipe",
    diet: Diet.Meat,
    cookTime: 20,
    publishedAt: "",
    ingredients: [{name: "", unit: Unit.NONE}],
    steps: [""],
    source: "",
    servings: {
      count: 2,
    },
    tags: [],
  };

  const availableTags = await getRecipeTags();
  const lang = locale ? locale : "en-US";
  return {
    props: {
      ...(await serverSideTranslations(lang, ["common", "header", "footer", "recipe"])),
      initRecipe,
      availableTags,
    },
  };
};

export default function CreateRecipe({initRecipe, availableTags}: InferGetServerSidePropsType<
  typeof getServerSideProps
>) {
  const { t } = useTranslation("common");
  const [ recipe, setRecipe ] = useState(initRecipe);
  const [ recipeImageFile, setRecipeImageFile ] = useState<File | undefined>(undefined);
  const [ errorMessage, setErrorMessage ] = useState();
  const [ showErrorMessage, setShowErrorMessage ] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => setShowErrorMessage(false), 5000);
    }
  }, [errorMessage])

  async function saveRecipe() {
    try {
      const result = await uploadRecipe(recipe);
      if (recipeImageFile) {
        await uploadImage(result.imagePutURL, recipeImageFile);
      }

      router.push(`/r/${result.recipeID}?invalidate=true`);
    } catch (error) {
      console.error(error);
      setErrorMessage(error.toString());
      setShowErrorMessage(true);
    }
  }

  return (
    <>
      <PageTitle title={t("create.pagetitle")} />
      <EditRecipe
        title={t("create.displaytitle")}
        recipe={recipe}
        setRecipe={setRecipe}
        saveRecipe={saveRecipe}
        setRecipeImageFile={setRecipeImageFile}
        availableTags={availableTags}
      />
      <ErrorNotification
        message={errorMessage}
        show={showErrorMessage}
      />
    </>
  );
}
