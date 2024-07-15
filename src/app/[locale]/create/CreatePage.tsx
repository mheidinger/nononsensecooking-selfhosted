"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { uploadRecipe } from "~/actions";
import { Diet } from "~/models/Diet";
import { type BaseRecipe } from "~/models/Recipe";
import { Unit } from "~/models/Unit";
import { useRouter } from "~/navigation";
import { convertErrorsToMessage } from "~/util";
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

async function uploadImage(url: string, image: File) {
  await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": image.type,
    },
    body: image,
  });
}

export default function CreatePage({ availableTags }: Props) {
  const t = useTranslations("common");
  const [recipe, setRecipe] = useState(initRecipe);
  const [recipeImageFile, setRecipeImageFile] = useState<File | undefined>(
    undefined,
  );
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const router = useRouter();

  async function saveRecipe() {
    const recipeClone = structuredClone(recipe);
    // Remove empty ingredients and steps to avoid API error
    recipeClone.ingredients = recipeClone.ingredients.filter((i) => i.name);
    recipeClone.steps = recipeClone.steps.filter((s) => s);
    const result = await uploadRecipe({ recipe: recipeClone });

    if (result?.validationErrors) {
      setErrorMessage(
        convertErrorsToMessage(result.validationErrors) ?? "Validation error",
      );
      setShowErrorMessage(true);
      return;
    }

    if (!result?.data || result?.serverError) {
      setErrorMessage(result?.serverError ?? "Unknown error occured");
      setShowErrorMessage(true);
      return;
    }

    if (recipeImageFile) {
      await uploadImage(result.data.imagePutURL, recipeImageFile);
    }
    router.push(`/recipes/${result.data.recipeID}?invalidate=true`);
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
      <ErrorNotification
        message={errorMessage}
        show={showErrorMessage}
        onHide={() => setShowErrorMessage(false)}
      />
    </>
  );
}
