"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { type Recipe } from "~/models/Recipe";
import ErrorNotification from "../../../_components/ErrorNotification";
import Button from "../../../_components/inputs/Button";

import { deleteRecipe } from "~/actions";
import { useRouter } from "~/navigation";
import { convertErrorsToMessage } from "~/util";
import styles from "./DeletePage.module.css";

interface Props {
  recipe: Recipe;
}

export default function DeleteRecipe({ recipe }: Props) {
  const t = useTranslations("recipe");
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const router = useRouter();

  function goBack() {
    router.push(`/recipes/${recipe.id}`);
  }

  async function performDelete() {
    const result = await deleteRecipe(recipe.id);

    if (result?.validationErrors) {
      setErrorMessage(
        convertErrorsToMessage(result.validationErrors) ?? "Validation error",
      );
      setShowErrorMessage(true);
      return;
    }

    if (result?.serverError) {
      setErrorMessage(result?.serverError ?? "Unknown error occured");
      setShowErrorMessage(true);
      return;
    }

    router.push("/?invalidate=true");
  }

  return (
    <>
      <div className={styles.container}>
        <h2 className={styles.title}>{t("delete.question")}</h2>
        <p className={styles.recipeName}>{recipe.name}</p>
        <div className={styles.linkBox}>
          <Button className={styles.backButton} onClick={goBack}>
            {t("delete.back")}
          </Button>
          <Button className={styles.deleteButton} onClick={performDelete}>
            {t("delete.delete")}
          </Button>
        </div>
      </div>
      <ErrorNotification
        show={showErrorMessage}
        message={errorMessage}
        onHide={() => setShowErrorMessage(false)}
      />
    </>
  );
}
