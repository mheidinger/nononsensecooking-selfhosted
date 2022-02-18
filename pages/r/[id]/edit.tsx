import { GetServerSideProps, GetStaticProps, InferGetServerSidePropsType, InferGetStaticPropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { fetchSingleRecipe } from "../../../lib/recipes";
import { uploadImage, uploadRecipe } from "../../../lib/client/upload";
import PageTitle from "../../../components/PageTitle";
import EditRecipe from "../../../components/edit/EditRecipe";
import ErrorNotification from "../../../components/edit/ErrorNotification";

export const getServerSideProps: GetServerSideProps = async ({ locale, params }) => {
  const { id } = params!;
  const recipe = await fetchSingleRecipe(id as string);

  const lang = locale ? locale : "en-US";
  return {
    props: {
      ...(await serverSideTranslations(lang, ["common", "header", "footer", "recipe"])),
      recipe,
    },
  };
};

export default function CreateRecipe({recipe: origRecipe}: InferGetServerSidePropsType<
  typeof getServerSideProps
>) {
  const { t } = useTranslation("common");
  const [ recipe, setRecipe ] = useState(origRecipe);
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
      const result = await uploadRecipe(recipe, true);
      if (recipeImageFile) {
        await uploadImage(result.imagePutURL, recipeImageFile);
      }

      router.push(`/r/${result.recipeID}`);
    } catch (error) {
      console.error(error);
      setErrorMessage(error.toString());
      setShowErrorMessage(true);
    }
  }

  return (
    <>
      <PageTitle title={t("edit.pagetitle")} />
      <EditRecipe
        title={t("edit.displaytitle")}
        recipe={recipe}
        setRecipe={setRecipe}
        saveRecipe={saveRecipe}
        setRecipeImageFile={setRecipeImageFile}
      />
      <ErrorNotification
        message={errorMessage}
        show={showErrorMessage}
      />
    </>
  );
}
