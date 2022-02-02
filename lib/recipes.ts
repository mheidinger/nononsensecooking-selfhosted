import fs from "fs/promises";
import path from "path";
import YAML from "yaml";
import { Recipe, RecipeFile, RecipeInIndex } from "../models/Recipe";
import { Unit } from "../models/Unit";

const VERCEL_URL = process.env.VERCEL_URL;
const recipeFilesBasePath = "public/recipes";

/**
 * Retrieves the recipe index via HTTP. This function cannot be used during static generation, only in serverless mode!
 * @returns The list of recipes in the index
 *
 * TODO: Error Handling
 */
export async function fetchRecipeIndex(): Promise<RecipeInIndex[]> {
  const baseUrl = VERCEL_URL
    ? `https://${VERCEL_URL}`
    : "http://localhost:3000";
  const recipeIndexPath = `/recipes/index.json`;
  const allRecipes = await (await fetch(baseUrl + recipeIndexPath)).json();

  return allRecipes;
}

/**
 * Reads and parses all recipes found on disk for the given language. This function cannot be used in serverless mode, only during static generation!
 * @returns The fully parsed recipes
 */
export async function loadRecipesFromDisk(): Promise<Recipe[]> {
  const files = await fs.readdir(
    path.join(process.cwd(), recipeFilesBasePath)
  );
  const recipeFiles = files.filter((filename) => filename.endsWith(".yaml"))
  const allRecipes = await Promise.all(
    recipeFiles.map(async (filename) => {
      const file = await fs.readFile(
        path.join(recipeFilesBasePath, filename),
        "utf-8"
      );
      const id = filename.split(".")[0];
      const recipeData = YAML.parse(file);
      return parseRecipeData(id, recipeData);
    })
  );

  return allRecipes;
}

export async function readSingleRecipeFromDisk(
  id: string
) {
  const file = await fs.readFile(
    path.join(recipeFilesBasePath, `${id}.yaml`),
    "utf-8"
  );
  console.log("Read recipe from file", `${id}.yaml`);
  const recipeData = YAML.parse(file);
  return parseRecipeData(id, recipeData);
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
