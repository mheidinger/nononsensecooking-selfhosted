import YAML from "yaml";
import NodeCache from "node-cache";
import { Recipe, RecipeFile, RecipeInIndex, toRecipeInIndex } from "../models/Recipe";
import { Unit } from "../models/Unit";
import { fetchS3File, getSignedGetObjectUrl, listFiles } from "./s3client";

const s3RecipeFilesBasePath = "data"
const s3RecipeImagesBasePath = "images"

const INDEX_CACHE_KEY = "index";
const SIGNED_IMAGE_URL_TTL = 3600;
const STD_TTL = 600;
const CHECK_PERIOD = 120;
const recipeCache = new NodeCache({stdTTL: STD_TTL, checkperiod: CHECK_PERIOD});

// TODO: With in app modifications, invalidate after such
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
    const file = await fetchS3File(`${s3RecipeFilesBasePath}/${id}.yaml`);
    console.log("Read recipe from S3 for id", id);
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
    url = await getSignedGetObjectUrl(`${s3RecipeImagesBasePath}/${id}.jpg`, SIGNED_IMAGE_URL_TTL * 1.2);
    recipeCache.set(cacheKey, url);
  } else {
    console.log("Cache hit for recipe image URL", id);
  }
  return url;
}

const parseRecipeData = (id: string, recipeData: RecipeFile): Recipe => ({
  ...recipeData,
  id,
  ingredients: parseIngredients(recipeData.ingredients),
  publishedAt: recipeData.publishedAt,
});

const parseIngredients = (
  ingredients: Recipe["ingredients"]
): Recipe["ingredients"] =>
  ingredients.map((ingredient) => ({
    ...ingredient,
    unit: ingredient.unit || Unit.NONE,
  }));
