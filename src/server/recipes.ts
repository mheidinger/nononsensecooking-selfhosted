import Fuse from "fuse.js";
import "server-only";
import YAML from "yaml";
import { BaseRecipe, type Recipe } from "../models/Recipe";
import {
  getPathForImage,
  getPathForOptimizedImage,
  getPathForRecipe,
  S3RecipeFilesBasePath,
} from "./s3Paths";
import { getS3Client } from "./s3client";

const s3Client = getS3Client();

const SIGNED_IMAGE_URL_TTL = 3600;

async function getRecipeList(): Promise<string[]> {
  const files = await s3Client.listFiles(S3RecipeFilesBasePath + "/");
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
  const file = await s3Client.fetchFileAsString(getPathForRecipe(id));
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
  const optimizedImageExists = await s3Client.fileExists(imagePath);
  if (!optimizedImageExists) {
    imagePath = getPathForImage(id);
    const imageExists = await s3Client.fileExists(imagePath);
    if (!imageExists) {
      return null;
    }
  }

  return await s3Client.getSignedUrl(
    imagePath,
    "get",
    SIGNED_IMAGE_URL_TTL * 1.2,
  );
}

export async function createRecipe(
  id: string,
  recipe: BaseRecipe,
  allowExisting: boolean,
): Promise<string> {
  const key = getPathForRecipe(id);
  const alreadyExists = await s3Client.fileExists(key);
  if (alreadyExists && !allowExisting) {
    throw new Error("recipe id (name) already exists");
  }
  await s3Client.uploadFile(key, JSON.stringify(recipe));
  return s3Client.getSignedUrl(getPathForImage(id), "put");
}

export async function deleteRecipe(id: string) {
  const recipePath = getPathForRecipe(id);
  try {
    await s3Client.deleteFile(recipePath);
  } catch (error) {
    console.error("Failed to delete recipe with id: ", id);
  }

  const imagePath = getPathForImage(id);
  try {
    await s3Client.deleteFile(imagePath);
  } catch (error) {
    console.error("Failed to delete recipe image with id: ", id);
  }

  const optimizedImagePath = getPathForOptimizedImage(id);
  try {
    await s3Client.deleteFile(optimizedImagePath);
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
