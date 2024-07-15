"use client";

import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { type Ingredient } from "~/models/Ingredient";
import { type BaseRecipe } from "~/models/Recipe";
import Heading from "../Heading";
import GeneralInformation from "./GeneralInformation";
import Ingredients from "./Ingredients";
import Button from "./inputs/Button";
import InputRow from "./inputs/InputRow";
import Steps from "./Steps";

import styles from "./EditRecipe.module.css";

type Props = {
  title: string;
  recipe: BaseRecipe;
  setRecipe(recipe: BaseRecipe): void;
  saveRecipe(): void;
  setRecipeImageFile(file?: File): void;
  availableTags: string[];
};

const EditRecipe = ({
  title,
  recipe,
  setRecipe,
  saveRecipe,
  setRecipeImageFile,
  availableTags,
}: Props) => {
  const t = useTranslations("recipe");
  const setIngredients = useCallback(
    (ingredients: Ingredient[]) => {
      setRecipe({ ...recipe, ingredients });
    },
    [recipe, setRecipe],
  );
  const setSteps = useCallback(
    (steps: string[]) => {
      setRecipe({ ...recipe, steps });
    },
    [recipe, setRecipe],
  );

  return (
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
          recipe={recipe}
          setRecipe={setRecipe}
          setRecipeImageFile={setRecipeImageFile}
          availableTags={availableTags}
        />
        <hr className={styles.horizontalLine} />
        <Ingredients
          ingredients={recipe.ingredients}
          setIngredients={setIngredients}
        />
      </div>
      <hr
        className={clsx(styles.horizontalLine, styles.columnHorizontalLine)}
      />
      <div className={styles.rowVerticalLine} />
      <div className={styles.rightSide}>
        <Steps steps={recipe.steps} setSteps={setSteps} />
      </div>
    </div>
  );
};

export default EditRecipe;
