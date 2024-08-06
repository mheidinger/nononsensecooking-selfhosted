import Fuse from "fuse.js";
import "server-only";
import YAML from "yaml";
import { BaseRecipe, type Recipe } from "../models/Recipe";
import {
  deleteFile,
  fetchFileAsString,
  fileExists,
  getSignedGetObjectUrl,
  getSignedPutObjectUrl,
  listFiles,
  uploadFile,
} from "./s3client";
import {
  getPathForImage,
  getPathForOptimizedImage,
  getPathForRecipe,
  S3RecipeFilesBasePath,
} from "./s3Paths";

const SIGNED_IMAGE_URL_TTL = 3600;

async function getRecipeList(): Promise<string[]> {
  const files = await listFiles(S3RecipeFilesBasePath + "/");
  const recipeIdList = files.map((file) => file.key.replace(".yaml", ""));
  return recipeIdList;
}

export async function fetchRecipes(): Promise<Recipe[]> {
  const recipeList = await getRecipeList();

  return await Promise.all(recipeList.map((id) => fetchSingleRecipe(id)));
}

export async function getRecipeTags(): Promise<string[]> {
  const recipes = await fetchRecipes();
  const tagSet = new Set<string>();
  recipes.forEach((recipe) => recipe.tags.forEach((tag) => tagSet.add(tag)));
  return Array.from(tagSet);
}

export async function fetchSingleRecipe(id: string): Promise<Recipe> {
  console.log("Read recipe from S3 for id", id);
  const file = await fetchFileAsString(getPathForRecipe(id));
  const baseRecipe = BaseRecipe.parse(YAML.parse(file));
  const imageUrl = await getRecipeImageUrl(id);

  const recipe = {
    ...baseRecipe,
    id,
    imageUrl,
  };
  return recipe;
}

async function getRecipeImageUrl(id: string): Promise<string | null> {
  let imagePath = getPathForOptimizedImage(id);
  if (!(await fileExists(imagePath))) {
    imagePath = getPathForImage(id);
    if (!(await fileExists(imagePath))) {
      return null;
    }
  }

  return await getSignedGetObjectUrl(imagePath, SIGNED_IMAGE_URL_TTL * 1.2);
}

export async function createRecipe(
  id: string,
  recipe: BaseRecipe,
  allowExisting: boolean,
): Promise<string> {
  const key = getPathForRecipe(id);
  if ((await fileExists(key)) && !allowExisting) {
    throw new Error("recipe id (name) already exists");
  }
  await uploadFile(key, JSON.stringify(recipe));
  return getSignedPutObjectUrl(getPathForImage(id));
}

export async function deleteRecipe(id: string) {
  const recipePath = getPathForRecipe(id);
  try {
    await deleteFile(recipePath);
  } catch (error) {
    console.error("Failed to delete recipe with id: ", id);
  }

  const imagePath = getPathForImage(id);
  try {
    await deleteFile(imagePath);
  } catch (error) {
    console.error("Failed to delete recipe image with id: ", id);
  }

  const optimizedImagePath = getPathForOptimizedImage(id);
  try {
    await deleteFile(optimizedImagePath);
  } catch (error) {
    console.error("Failed to delete optimized recipe image with id: ", id);
  }
}

export async function searchRecipes(searchTerm: string): Promise<Recipe[]> {
  const recipes = await fetchRecipes();
  const fuse = new Fuse(recipes, {
    isCaseSensitive: false,
    includeScore: true,
    includeMatches: false,
    findAllMatches: false,
    minMatchCharLength: 2,
    threshold: 0.4,
    distance: 100,
    useExtendedSearch: false,
    ignoreLocation: false,
    ignoreFieldNorm: false,
    shouldSort: true,
    keys: ["name"],
    fieldNormWeight: 0,
  });

  const cleanSearchTerm = searchTerm.trim().replace(/[<>]/g, "");
  return fuse.search(cleanSearchTerm).map((result) => result.item);
}
