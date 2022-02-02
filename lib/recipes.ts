import YAML from "yaml";
import { Recipe, RecipeFile, RecipeInIndex } from "../models/Recipe";
import { Unit } from "../models/Unit";
import { fetchS3File, getSignedGetObjectUrl } from "./s3client";

const tempIndex = '[{"name":"Halloumi-Pommes","image":"halloumi-fries.jpg","publishedAt":"2021-08-27T17:31:49.831Z","cookTime":20,"diet":"vegetarian","id":"2IJ5-UnErv"},{"name":"Einfaches Bananeneis","image":"banana-icecream.jpg","publishedAt":"2021-08-11T20:36:58.221Z","cookTime":5,"diet":"vegetarian","id":"9ZHh13BR6p"},{"name":"Gefüllte Zucchini mit Quinoa, Feta und Spinat","image":"stuffed-zucchini-quinoa.jpg","publishedAt":"2021-08-11T20:36:58.221Z","cookTime":45,"diet":"vegetarian","id":"9htxuuEEZ5"},{"name":"Schokopuddingdessert mit Mango","image":"chocolatepudding-mango.jpg","publishedAt":"2021-08-11T20:36:58.221Z","cookTime":10,"diet":"vegetarian","id":"CsAUM3IwIN"},{"name":"Spinatwraps mit Dillcreme","image":"spinatwraps-min.jpg","publishedAt":"2021-08-18T20:08:13.465Z","cookTime":35,"diet":"vegetarian","id":"KUvCHXi5t8"},{"name":"Burrito mit weißen Bohnen und Süßkartoffel","image":"bean-burritos-min.jpg","publishedAt":"2021-08-11T20:36:58.221Z","cookTime":20,"diet":"vegetarian","id":"LXLS2EDaml"},{"name":"Kokosdal","image":"coconut-dal.jpg","publishedAt":"2021-08-11T20:36:58.221Z","cookTime":25,"diet":"vegan","id":"SJryfOFb1R"},{"name":"Schupfnudeln mit Gemüsesahnesoße","image":"schupfnudeln-vegetable-sauce.jpg","publishedAt":"2021-08-11T20:36:58.221Z","cookTime":25,"diet":"vegetarian","id":"Ti0Q9m2wZR"},{"name":"Einfache Quesadillas","image":"quesadillas.jpg","publishedAt":"2021-09-29T20:50:22.081Z","cookTime":20,"diet":"vegetarian","id":"WhkAMQbBqE"},{"name":"Reisgefüllte Paprika","image":"rice-stuffed-bell-pepper.jpg","publishedAt":"2021-08-19T19:19:32.655Z","cookTime":30,"diet":"vegetarian","id":"YZvnsRZuuh"},{"name":"Vanillepuddingdessert mit Apfelmus","image":"placeholder-min.jpg","publishedAt":"2021-08-11T20:36:58.221Z","cookTime":10,"diet":"vegetarian","id":"geELhSY96S"},{"name":"Karotten-Rotkohl-Salat","image":"carrot-red-cabbage-salad.jpg","publishedAt":"2021-12-15T19:46:41.357Z","cookTime":15,"diet":"vegetarian","id":"hFLfAfrezp"},{"name":"Tacos mit Gemüse und Tofu","image":"tacos-vegetables-tofu.jpg","publishedAt":"2021-08-11T20:36:58.221Z","cookTime":35,"diet":"vegan","id":"kZj3AaOlx3"},{"name":"Chinesische Nudeln mit Brokkoli und Karotte","image":"chinese-noodles-broccoli-carrot-min.jpg","publishedAt":"2021-08-11T20:36:58.221Z","cookTime":25,"diet":"vegan","id":"udsxxsVSiZ"},{"name":"Bratkaroffeln mit Paprika und Ei","image":"fried-potatoes-egg-min.jpg","publishedAt":"2021-08-11T20:36:58.221Z","cookTime":20,"diet":"vegetarian","id":"zsFOCNkBNz"}]'
const s3RecipeFilesBasePath = "data"

// TODO: Create on demand based on S3 then cache and update regularly
export async function fetchRecipeIndex(): Promise<RecipeInIndex[]> {
  return JSON.parse(tempIndex)
}

// TODO: Add caching of S3 files => last changed?
export async function fetchSingleRecipe(id: string) {
  const file = await fetchS3File(`${s3RecipeFilesBasePath}/${id}.yaml`);
  console.log("Read recipe from S3 for id", id);
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
