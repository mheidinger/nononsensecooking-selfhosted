import { NextApiRequest, NextApiResponse } from "next";
import { string } from "prop-types";
import slug from "slug";
import { createRecipe } from "../../lib/recipes";
import { Ingredient } from "../../models/Ingredient";
import { Diet, Recipe } from "../../models/Recipe";
import { Unit } from "../../models/Unit";
import { methodIs } from "./utils/methodIs";

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

function parseBody(body: any): Recipe {
  if (!body || typeof body !== "object") {
    throw new ValidationError("no body");
  }

  const recipe: Recipe = {
    id: "",
    name: "",
    publishedAt: new Date().toISOString(),
    cookTime: 0,
    diet: Diet.Meat,
    ingredients: [],
    steps: [],
    source: "",
    servings: {
      count: 0,
    }
  };

  if (!body.name || typeof body.name !== "string"|| body.name === "") {
    throw new ValidationError("no recipe name");
  }
  recipe.name = body.name;
  recipe.id = slug(recipe.name);

  if (body.id && typeof body.id === "string" && body.id !== "") {
    recipe.id = body.id;
  }

  if (!body.cookTime || typeof body.cookTime !== "number") {
    throw new ValidationError("no recipe cook time");
  }
  recipe.cookTime = body.cookTime;

  if (!body.diet || typeof body.diet !== "string" || body.diet === "") {
    throw new ValidationError("no recipe diet");
  }
  recipe.diet = body.diet;

  if (body.source && typeof body.source === "string" && body.source !== "") {
    recipe.source = body.source;
  }

  if (!body.steps || !Array.isArray(body.steps) || body.steps.length === 0) {
    throw new ValidationError("no recipe steps");
  }
  for (const step of body.steps) {
    if (typeof step !== "string") {
      throw new ValidationError("recipe step is not a string");
    }
    recipe.steps.push(step);
  }

  if (!body.ingredients || !Array.isArray(body.ingredients) || body.ingredients.length === 0) {
    throw new ValidationError("no recipe steps");
  }
  for (const ingredient of body.ingredients) {
    const cleanIngredient: Ingredient = {
      name: "",
      unit: Unit.NONE
    };
    if (!ingredient || typeof ingredient !== "object") {
      throw new ValidationError("ingredient is not an object");
    }
    if (!ingredient.name || typeof ingredient.name !== "string" || ingredient.name === "") {
      throw new ValidationError("no ingredient name");
    }
    cleanIngredient.name = ingredient.name;
    if (ingredient.unit && typeof ingredient.unit === "string" && ingredient.unit !== "") {
      cleanIngredient.unit = ingredient.unit;
    }
    if (cleanIngredient.unit !== Unit.NONE && ingredient.amount && typeof ingredient.amount === "number" && ingredient.amount > 0) {
      cleanIngredient.amount = ingredient.amount;
    } else if (cleanIngredient.unit !== Unit.NONE) {
      throw new ValidationError(`ingredient unit set but no amount for '${cleanIngredient.name}'`);
    }
    recipe.ingredients.push(cleanIngredient);
  }

  if (!body.servings || typeof body.servings !== "object" || !body.servings.count || body.servings.count <= 0) {
    throw new ValidationError("no servings, servings count or count not greater 0");
  }
  recipe.servings.count = body.servings.count;
  if (body.servings.label) {
    recipe.servings.label = body.servings.label;
  }

  return recipe;
}

export default async function create(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!methodIs(["POST", "PUT"], req, res)) return;

  try {
    const recipe = parseBody(req.body);
    const imagePutURL = await createRecipe(recipe, req.method === "PUT");
    res.status(200).json({recipeID: recipe.id, imagePutURL: imagePutURL});
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({message: error.message});
      return;
    }
    res.status(500).json({message: error.message});
  }
}

