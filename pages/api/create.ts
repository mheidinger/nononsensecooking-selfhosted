import { NextApiRequest, NextApiResponse } from "next";
import { string } from "prop-types";
import slug from "slug";
import { createRecipe } from "../../lib/recipes";
import { Ingredient } from "../../models/Ingredient";
import { Diet, Recipe } from "../../models/Recipe";
import { methodIs } from "./utils/methodIs";

function parseBody(body: any): Recipe {
  if (!body || typeof body !== "object") {
    throw new TypeError("no body");
  }

  const recipe: Recipe = {
    id: "",
    name: "",
    publishedAt: new Date().toISOString(),
    cookTime: 0,
    diet: Diet.Meat,
    ingredients: [],
    steps: []
  };

  if (!body.name || typeof body.name !== "string"|| body.name === "") {
    throw new TypeError("no recipe name");
  }
  recipe.name = body.name;
  recipe.id = slug(recipe.name);

  if (!body.cookTime || typeof body.cookTime !== "number") {
    throw new TypeError("no recipe cook time");
  }
  recipe.cookTime = body.cookTime;

  if (!body.diet || typeof body.diet !== "string" || body.diet === "") {
    throw new TypeError("no recipe diet");
  }
  recipe.diet = body.diet;

  if (!body.steps || !Array.isArray(body.steps) || body.steps.length === 0) {
    throw new TypeError("no recipe steps");
  }
  for (const step of body.steps) {
    if (typeof step !== "string") {
      throw new TypeError("recipe step is not a string");
    }
    recipe.steps.push(step);
  }

  if (!body.ingredients || !Array.isArray(body.ingredients) || body.ingredients.length === 0) {
    throw new TypeError("no recipe steps");
  }
  for (const ingredient of body.ingredients) {
    const cleanIngredient: Ingredient = {
      name: ""
    };
    if (!ingredient || typeof ingredient !== "object") {
      throw new TypeError("ingredient is not an object");
    }
    if (!ingredient.name || typeof ingredient.name !== "string" || ingredient.name === "") {
      throw new TypeError("no ingredient name");
    }
    cleanIngredient.name = ingredient.name;
    if (ingredient.amount && typeof ingredient.amount === "number" && ingredient.amount > 0) {
      cleanIngredient.amount = ingredient.amount;
    }
    if (ingredient.unit && typeof ingredient.unit === "string" && ingredient.unit !== "") {
      cleanIngredient.unit = ingredient.unit;
    }
    recipe.ingredients.push(cleanIngredient);
  }

  return recipe;
}

export default async function create(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!methodIs("POST", req, res) && !methodIs("PUT", req, res)) return;

  try {
    const recipe = parseBody(req.body);
    const imagePutURL = await createRecipe(recipe, req.method === "PUT");
    res.status(200).json({recipeID: recipe.id, imagePutURL: imagePutURL});
  } catch (error) {
    if (error instanceof TypeError) {
      res.status(400).json({message: error.message});
      return;
    }
    res.status(500).json({message: error.message});
  }
}

