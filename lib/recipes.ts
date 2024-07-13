import YAML from "yaml";
import NodeCache from "node-cache";
import {
  Recipe,
  RecipeFile,
  RecipeInIndex,
  toRecipeInIndex,
} from "../models/Recipe";
import { Unit } from "../models/Unit";
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

const INDEX_CACHE_KEY = "index";
const SIGNED_IMAGE_URL_TTL = 3600;
const STD_TTL = 600;
const CHECK_PERIOD = 120;
const recipeCache = new NodeCache({
  stdTTL: STD_TTL,
  checkperiod: CHECK_PERIOD,
});

export function invalidateCache(id: string) {
  console.log("Clear cache for index and", id);
  recipeCache.del([INDEX_CACHE_KEY, id]);
}

export async function fetchRecipeIndex(): Promise<RecipeInIndex[]> {
  let index = recipeCache.get(INDEX_CACHE_KEY) as RecipeInIndex[];
  if (index == undefined) {
    const recipeFiles = await listFiles(S3RecipeFilesBasePath + "/");
    const recipes = await Promise.all(
      recipeFiles.map((file) =>
        fetchSingleRecipe(file.key.replace(".yaml", "")),
      ),
    );
    index = recipes.map((recipe) => toRecipeInIndex(recipe));
    recipeCache.set(INDEX_CACHE_KEY, index);
  }

  return Promise.all(
    index.map(async (item) => {
      item.s3Url = await getRecipeImageUrl(item.id);
      return item;
    }),
  );
}

export async function getRecipeTags(): Promise<string[]> {
  const index = await fetchRecipeIndex();
  const tagSet = new Set<string>();
  index.forEach((recipe) => recipe.tags.forEach((tag) => tagSet.add(tag)));
  return Array.from(tagSet);
}

export async function fetchSingleRecipe(id: string): Promise<Recipe> {
  let recipe = recipeCache.get(id) as Recipe;
  if (recipe == undefined) {
    console.log("Read recipe from S3 for id", id);
    const file = await fetchFileAsString(getPathForRecipe(id));
    const recipeData = YAML.parse(file);
    recipe = parseRecipeData(id, recipeData);
    recipeCache.set(id, recipe);
  } else {
    console.log("Cache hit for recipe", id);
  }
  return recipe;
}

interface RecipeImageCacheEntry {
  url: string | null;
}

export async function getRecipeImageUrl(id: string): Promise<string | null> {
  const cacheKey = `SIGNED_IMAGE_URL_${id}`;
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
      url = await getSignedGetObjectUrl(
        imagePath,
        SIGNED_IMAGE_URL_TTL * 1.2,
      );
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
  recipe: Recipe,
  allowExisting: boolean,
): Promise<string> {
  const key = getPathForRecipe(recipe.id);
  if ((await fileExists(key)) && !allowExisting) {
    throw new Error("recipe id (name) already exists");
  }
  uploadFile(key, JSON.stringify(recipe));
  return getSignedPutObjectUrl(getPathForImage(recipe.id));
}

// Called from API => different recipeCache instance!
export async function deleteRecipe(id: string) {
  const recipeKey = getPathForRecipe(id);
  try {
    deleteFile(recipeKey);
  } catch (error) {
    console.error("Failed to delete recipe with id: ", id);
  }

  const imageKey = getPathForImage(id);
  try {
    deleteFile(imageKey);
  } catch (error) {
    console.error("Failed to delete recipe image with id: ", id);
  }
}

const parseRecipeData = (id: string, recipeData: RecipeFile): Recipe => ({
  ...recipeData,
  id,
  ingredients: parseIngredients(recipeData.ingredients),
  publishedAt: recipeData.publishedAt,
  source: recipeData.source || "",
  servings: parseServings(recipeData.servings),
  tags: recipeData.tags || [],
});

function parseServings(servings: RecipeFile["servings"]): Recipe["servings"] {
  const returnServings: Recipe["servings"] = {
    count: servings?.count || 1,
  };
  if (servings && servings.label) {
    returnServings.label = servings.label;
  }
  return returnServings;
}

function parseIngredients(
  ingredients: RecipeFile["ingredients"],
): Recipe["ingredients"] {
  return ingredients.map((ingredient) => ({
    ...ingredient,
    unit: ingredient.unit || Unit.NONE,
  }));
}
