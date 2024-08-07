"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { deleteRecipe } from "~/actions";
import { type Recipe } from "~/models/Recipe";
import { useRouter } from "~/navigation";
import { convertErrorsToMessage } from "~/util";
import ErrorNotification from "~components/ErrorNotification";
import Button from "~components/inputs/Button";
import LoadingSpinner from "~components/LoadingSpinner";

import styles from "./DeletePage.module.css";

interface Props {
  recipe: Recipe;
}

export default function DeleteRecipe({ recipe }: Props) {
  const t = useTranslations("recipe");
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  function goBack() {
    router.push(`/recipes/${recipe.id}`);
  }

  async function performDelete() {
    setIsDeleting(true);
    const result = await deleteRecipe(recipe.id);

    if (result?.validationErrors) {
      setErrorMessage(
        convertErrorsToMessage(result.validationErrors) ?? "Validation error",
      );
      setIsDeleting(false);
      setShowErrorMessage(true);
      return;
    }

    if (result?.serverError) {
      setErrorMessage(result?.serverError ?? "Unknown error occured");
      setShowErrorMessage(true);
      setIsDeleting(false);
      return;
    }

    router.push("/");
  }

  return (
    <>
      {isDeleting && <LoadingSpinner />}
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
