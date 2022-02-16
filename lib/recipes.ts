import YAML from "yaml";
import NodeCache from "node-cache";
import { Recipe, RecipeFile, RecipeInIndex, toRecipeInIndex } from "../models/Recipe";
import { Unit } from "../models/Unit";
import { fetchFile, fileExists, getSignedGetObjectUrl, getSignedPutObjectUrl, listFiles, uploadFile } from "./s3client";

const s3RecipeFilesBasePath = "recipes"
const s3RecipeImagesBasePath = "images"

const INDEX_CACHE_KEY = "index";
const SIGNED_IMAGE_URL_TTL = 3600;
const STD_TTL = 600;
const CHECK_PERIOD = 120;
const recipeCache = new NodeCache({stdTTL: STD_TTL, checkperiod: CHECK_PERIOD});

export async function fetchRecipeIndex(): Promise<RecipeInIndex[]> {
  let index = recipeCache.get(INDEX_CACHE_KEY) as RecipeInIndex[];
  if (index == undefined) {
    const recipeFiles = await listFiles(s3RecipeFilesBasePath + "/");
    const recipes = await Promise.all(recipeFiles.map((file) => fetchSingleRecipe(file.key.replace(".yaml", ""))));
    index = recipes.map((recipe) => toRecipeInIndex(recipe));
    recipeCache.set(INDEX_CACHE_KEY, index);
  }
  return Promise.all(
    index.map(async (item) => {
      item.s3Url = await getRecipeImageUrl(item.id);
      return item;
    })
  )
}

export async function fetchSingleRecipe(id: string): Promise<Recipe> {
  let recipe = recipeCache.get(id) as Recipe;
  if (recipe == undefined) {
    console.log("Read recipe from S3 for id", id);
    const file = await fetchFile(getKeyForRecipe(id));
    const recipeData = YAML.parse(file);
    recipe = parseRecipeData(id, recipeData);
    recipeCache.set(id, recipe);
  } else {
    console.log("Cache hit for recipe", id);
  }
  return recipe;
}

export async function getRecipeImageUrl(id: string) {
  const cacheKey = `SIGNED_IMAGE_URL_${id}`;
  let url = recipeCache.get(cacheKey) as string;
  if (url == undefined) {
    url = await getSignedGetObjectUrl(getKeyForImage(id), SIGNED_IMAGE_URL_TTL * 1.2);
    recipeCache.set(cacheKey, url);
  } else {
    console.log("Cache hit for recipe image URL", id);
  }
  return url;
}

export async function createRecipe(recipe: Recipe, allowExisting: boolean): Promise<string> {
  const key = getKeyForRecipe(recipe.id);
  if (await fileExists(key) && !allowExisting) {
    throw new Error("recipe id (name) already exists")
  }
  uploadFile(key, JSON.stringify(recipe));
  recipeCache.del(INDEX_CACHE_KEY);
  return getSignedPutObjectUrl(getKeyForImage(recipe.id));
}

function getKeyForRecipe(id: string): string {
  return `${s3RecipeFilesBasePath}/${id}.yaml`;
}

function getKeyForImage(id: string): string {
  return `${s3RecipeImagesBasePath}/${id}.jpg`;
}

const parseRecipeData = (id: string, recipeData: RecipeFile): Recipe => ({
  ...recipeData,
  id,
  ingredients: parseIngredients(recipeData.ingredients),
  publishedAt: recipeData.publishedAt,
  source: recipeData.source || "",
  servings: parseServings(recipeData.servings),
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

const parseIngredients = (ingredients: RecipeFile["ingredients"]): Recipe["ingredients"] =>
  ingredients.map((ingredient) => ({
    ...ingredient,
    unit: ingredient.unit || Unit.NONE,
  }));
