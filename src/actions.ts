"use server";

import { createSafeActionClient } from "next-safe-action";
import slug from "slug";
import { z } from "zod";
import { BaseRecipe } from "./models/Recipe";
import {
  createRecipe,
  searchRecipes as serverSearchRecipes,
} from "./server/recipes";

const actionClient = createSafeActionClient();

export const searchRecipes = actionClient
  .schema(z.string())
  .action(async ({ parsedInput: searchTerm }) => {
    return serverSearchRecipes(searchTerm);
  });

export const uploadRecipe = actionClient
  .schema(z.object({ id: z.string().optional(), recipe: BaseRecipe }))
  .action(async ({ parsedInput: { id: providedId, recipe } }) => {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const id = providedId || slug(recipe.name);
    const imagePutURL = await createRecipe(id, recipe, !!providedId);
    return { recipeID: id, imagePutURL };
  });
