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
    throw new Error(`Create recipe API request failed: ${JSON.stringify(result)}`);
  }
  if (!result || !result.recipeID || !result.imagePutURL) {
    throw new Error(`Create recipe result not as expected: ${JSON.stringify(result)}`);
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

export async function deleteRecipe(id: string) {
  const response = await fetch("/api/delete", {
    method: "DELETE",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({id})
  });

  const result = await response.json();
  if (response.status !== 200) {
    throw new Error(`Delete recipe API request failed: ${JSON.stringify(result)}`);
  }
}
