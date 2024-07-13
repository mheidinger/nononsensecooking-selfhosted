import { Recipe } from "../../models/Recipe";

interface UploadRecipeResult {
  recipeID: string;
  imagePutURL: string;
}

export async function uploadRecipe(
  recipe: Recipe,
  update?: boolean,
): Promise<UploadRecipeResult> {
  const recipeClone = structuredClone(recipe);
  // Remove empty ingredients and steps to avoid API error
  recipeClone.ingredients = recipeClone.ingredients.filter((i) => i.name);
  recipeClone.steps = recipeClone.steps.filter((s) => s);

  const response = await fetch("/api/create", {
    method: update ? "PUT" : "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(recipeClone),
  });

  const result = await response.json();
  if (response.status !== 200) {
    console.error("Create recipe API request failed", result);
    throw result;
  }
  if (!result || !result.recipeID || !result.imagePutURL) {
    console.error("Create recipe result not as expected", result);
    throw new Error("Create recipe result not as expected");
  }

  return result;
}

export async function uploadImage(url: string, image: File) {
  await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": image.type,
    },
    body: image,
  });
}

export async function deleteRecipe(id: string) {
  const response = await fetch("/api/delete", {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });

  const result = await response.json();
  if (response.status !== 200) {
    throw new Error(
      `Delete recipe API request failed: ${JSON.stringify(result)}`,
    );
  }
}
