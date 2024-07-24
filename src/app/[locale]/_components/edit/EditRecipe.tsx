"use client";

import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import { type Ingredient } from "~/models/Ingredient";
import { type BaseRecipe, type Recipe } from "~/models/Recipe";
import Heading from "../Heading";
import Button from "../inputs/Button";
import InputRow from "../inputs/InputRow";
import GeneralInformation from "./GeneralInformation";
import Ingredients from "./Ingredients";
import Steps from "./Steps";

import { uploadRecipe } from "~/actions";
import { Diet } from "~/models/Diet";
import { useRouter } from "~/navigation";
import { convertErrorsToMessage } from "~/util";
import ErrorNotification from "../ErrorNotification";
import LoadingSpinner from "../LoadingSpinner";
import styles from "./EditRecipe.module.css";

type Props = {
  title: string;
  initialRecipe?: Recipe;
  availableTags: string[];
};

const newRecipe: BaseRecipe = {
  name: "New Recipe",
  diet: Diet.enum.meat,
  cookTime: 20,
  publishedAt: "",
  ingredients: [],
  steps: [],
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

const EditRecipe = ({ title, initialRecipe, availableTags }: Props) => {
  const t = useTranslations("recipe");

  const [editedRecipe, setEditedRecipe] = useState<BaseRecipe>(
    initialRecipe ?? newRecipe,
  );
  const [recipeImageFile, setRecipeImageFile] = useState<File | undefined>(
    undefined,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const router = useRouter();

  const setIngredients = useCallback(
    (ingredients: Ingredient[]) => {
      setEditedRecipe((prevValue) => ({ ...prevValue, ingredients }));
    },
    [setEditedRecipe],
  );

  const setSteps = useCallback(
    (steps: string[]) => {
      setEditedRecipe((prevValue) => ({ ...prevValue, steps }));
    },
    [setEditedRecipe],
  );

  async function saveRecipe() {
    setIsSaving(true);

    const recipeClone = structuredClone(editedRecipe);
    // Remove empty ingredients and steps to avoid API error
    recipeClone.ingredients = recipeClone.ingredients.filter((i) => i.name);
    recipeClone.steps = recipeClone.steps.filter((s) => s);
    const result = await uploadRecipe({
      id: initialRecipe?.id,
      recipe: recipeClone,
    });

    if (result?.validationErrors) {
      setErrorMessage(
        convertErrorsToMessage(result.validationErrors) ?? "Validation error",
      );
      setIsSaving(false);
      setShowErrorMessage(true);
      return;
    }

    if (!result?.data || result?.serverError) {
      setErrorMessage(result?.serverError ?? "Unknown error occured");
      setIsSaving(false);
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
      {isSaving && <LoadingSpinner />}
      <div className={styles.container}>
        <div className={styles.leftSide}>
          <InputRow>
            <Heading>{title}</Heading>
            <Button
              variant="add"
              onClick={saveRecipe}
              className={styles.saveButton}
            >
              {t("edit.save")}
            </Button>
          </InputRow>
          <GeneralInformation
            recipe={editedRecipe}
            setRecipe={setEditedRecipe}
            setRecipeImageFile={setRecipeImageFile}
            availableTags={availableTags}
          />
          <hr className={styles.horizontalLine} />
          <Ingredients
            initialIngredients={initialRecipe?.ingredients}
            onIngredientsUpdated={setIngredients}
          />
        </div>
        <hr
          className={clsx(styles.horizontalLine, styles.columnHorizontalLine)}
        />
        <div className={styles.rowVerticalLine} />
        <div className={styles.rightSide}>
          <Steps
            initialSteps={initialRecipe?.steps}
            onStepsUpdated={setSteps}
          />
        </div>
      </div>
      <ErrorNotification
        message={errorMessage}
        show={showErrorMessage}
        onHide={() => setShowErrorMessage(false)}
      />
    </>
  );
};

export default EditRecipe;
