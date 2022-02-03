import YAML from "yaml";
import { Recipe, RecipeFile, RecipeInIndex } from "../models/Recipe";
import { Unit } from "../models/Unit";
import { fetchS3File, getSignedGetObjectUrl } from "./s3client";

const tempIndex = '[{"name":"Halloumi-Pommes","publishedAt":"2021-08-27T17:31:49.831Z","cookTime":20,"diet":"vegetarian","id":"2IJ5-UnErv"},{"name":"Einfaches Bananeneis","publishedAt":"2021-08-11T20:36:58.221Z","cookTime":5,"diet":"vegetarian","id":"9ZHh13BR6p"},{"name":"Gefüllte Zucchini mit Quinoa, Feta und Spinat","publishedAt":"2021-08-11T20:36:58.221Z","cookTime":45,"diet":"vegetarian","id":"9htxuuEEZ5"},{"name":"Schokopuddingdessert mit Mango","publishedAt":"2021-08-11T20:36:58.221Z","cookTime":10,"diet":"vegetarian","id":"CsAUM3IwIN"},{"name":"Vanillepuddingdessert mit Apfelmus","publishedAt":"2021-08-11T20:36:58.221Z","cookTime":10,"diet":"vegetarian","id":"geELhSY96S"},{"name":"Karotten-Rotkohl-Salat","publishedAt":"2021-12-15T19:46:41.357Z","cookTime":15,"diet":"vegetarian","id":"hFLfAfrezp"}]';
const s3RecipeFilesBasePath = "data"
const s3RecipeImagesBasePath = "images"

// TODO: Create on demand based on S3 then cache and update regularly
export async function fetchRecipeIndex(): Promise<RecipeInIndex[]> {
  const index = JSON.parse(tempIndex) as RecipeInIndex[];
  return Promise.all(
    index.map(async (item) => {
      item.s3Url = await getRecipeImageUrl(item.id);
      return item;
    })
  )
}

// TODO: Add caching of S3 files => last changed?
export async function fetchSingleRecipe(id: string) {
  const file = await fetchS3File(`${s3RecipeFilesBasePath}/${id}.yaml`);
  console.log("Read recipe from S3 for id", id);
  const recipeData = YAML.parse(file);
  return parseRecipeData(id, recipeData);
}

// TODO: Add caching of these URLs
export async function getRecipeImageUrl(id: string) {
  return getSignedGetObjectUrl(`${s3RecipeImagesBasePath}/${id}.jpg`)
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
