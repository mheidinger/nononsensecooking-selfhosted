import YAML from "yaml";
import NodeCache from "node-cache";
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

const RECIPE_ID_LIST_CACHE_KEY = "index";
const SIGNED_IMAGE_URL_TTL = 3600;
const STD_TTL = 600;
const CHECK_PERIOD = 120;
const recipeCache = new NodeCache({
  stdTTL: STD_TTL,
  checkperiod: CHECK_PERIOD,
});

export function invalidateCache(id: string) {
  console.log("Clear cache for index and", id);
  recipeCache.del([RECIPE_ID_LIST_CACHE_KEY, id]);
}

async function getRecipeList(): Promise<string[]> {
  // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
  const cachedRecipeList = recipeCache.get(
    RECIPE_ID_LIST_CACHE_KEY,
  ) as string[];
  if (cachedRecipeList) {
    console.log("Cache hit for recipe list");
    return cachedRecipeList;
  }

  const files = await listFiles(S3RecipeFilesBasePath + "/");
  const recipeIdList = files.map((file) => file.key.replace(".yaml", ""));
  recipeCache.set(RECIPE_ID_LIST_CACHE_KEY, recipeIdList);
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
  // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
  const cachedRecipe = recipeCache.get(id) as Recipe;
  if (cachedRecipe) {
    console.log("Cache hit for recipe", id);
    return cachedRecipe;
  }

  console.log("Read recipe from S3 for id", id);
  const file = await fetchFileAsString(getPathForRecipe(id));
  const baseRecipe = BaseRecipe.parse(YAML.parse(file));
  const imageUrl = await getRecipeImageUrl(id);

  const recipe = {
    ...baseRecipe,
    id,
    imageUrl,
  };
  recipeCache.set(id, recipe);
  return recipe;
}

interface RecipeImageCacheEntry {
  url: string | null;
}

export async function getRecipeImageUrl(id: string): Promise<string | null> {
  const cacheKey = `SIGNED_IMAGE_URL_${id}`;
  // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
  const cacheHit = recipeCache.get(cacheKey) as RecipeImageCacheEntry;
  if (cacheHit == undefined) {
    let imagePath = getPathForOptimizedImage(id);
    const optimizedExists = await fileExists(imagePath);
    let exists = optimizedExists;
    if (!exists) {
      imagePath = getPathForImage(id);
      exists = await fileExists(imagePath);
    }

    let url: string | null = null;
    if (exists) {
      url = await getSignedGetObjectUrl(imagePath, SIGNED_IMAGE_URL_TTL * 1.2);
    }
    if (optimizedExists) {
      recipeCache.set(cacheKey, {
        url,
      } satisfies RecipeImageCacheEntry);
    }

    return url;
  } else {
    console.log("Cache hit for recipe image URL", id);
  }
  return cacheHit.url;
}

// Called from API => different recipeCache instance!
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

// Called from API => different recipeCache instance!
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
