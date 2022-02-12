import { Recipe } from "../../models/Recipe";

interface UploadRecipeResult {
  recipeID: string;
  imagePutURL: string;
}

export async function uploadRecipe(recipe: Recipe, update?: boolean): Promise<UploadRecipeResult> {
  const response = await fetch("/api/create", {
    method: update ? "PUT": "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(recipe)
  });

  const result = await response.json();
  if (response.status !== 200) {
    throw new Error(`Create recipe API request failed: ${result}`);
  }
  if (!result || !result.recipeID || !result.imagePutURL) {
    throw new Error(`Create recipe result not as expected: ${result}`);
  }

  return result;
}

export async function uploadImage(url: string, image: File) {
  await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": image.type
    },
    body: image
  });
}
