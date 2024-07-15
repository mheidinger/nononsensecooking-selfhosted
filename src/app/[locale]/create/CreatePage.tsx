"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Diet } from "~/models/Diet";
import { type BaseRecipe } from "~/models/Recipe";
import { Unit } from "~/models/Unit";
import { useRouter } from "~/navigation";
import ErrorNotification from "../_components/ErrorNotification";
import EditRecipe from "../_components/edit/EditRecipe";

interface Props {
  availableTags: string[];
}

const initRecipe: BaseRecipe = {
  name: "New Recipe",
  diet: Diet.enum.meat,
  cookTime: 20,
  publishedAt: "",
  ingredients: [{ name: "", unit: Unit.enum.none }],
  steps: [""],
  source: "",
  servings: {
    count: 2,
  },
  tags: [],
};

export default function CreatePage({ availableTags }: Props) {
  const t = useTranslations("common");
  const [recipe, setRecipe] = useState(initRecipe);
  const [recipeImageFile, setRecipeImageFile] = useState<File | undefined>(
    undefined,
  );
  const [errorMessage, setErrorMessage] = useState();
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => setShowErrorMessage(false), 5000);
    }
  }, [errorMessage]);

  async function saveRecipe() {
    // try {
    //   const result = await uploadRecipe(recipe);
    //   if (recipeImageFile) {
    //     await uploadImage(result.imagePutURL, recipeImageFile);
    //   }
    //   router.push(`/r/${result.recipeID}?invalidate=true`);
    // } catch (error) {
    //   const errorMessage = error.message ?? error.toString();
    //   setErrorMessage(errorMessage);
    //   setShowErrorMessage(true);
    // }
  }

  return (
    <>
      <EditRecipe
        title={t("create.displaytitle")}
        recipe={recipe}
        setRecipe={setRecipe}
        saveRecipe={saveRecipe}
        setRecipeImageFile={setRecipeImageFile}
        availableTags={availableTags}
      />
      <ErrorNotification message={errorMessage} show={showErrorMessage} />
    </>
  );
}
