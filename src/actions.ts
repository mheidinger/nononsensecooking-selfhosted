"use server";

import { createSafeActionClient } from "next-safe-action";
import { revalidatePath } from "next/cache";
import slug from "slug";
import { z } from "zod";
import { BaseRecipe } from "./models/Recipe";
import {
  createRecipe,
  deleteRecipe as serverDeleteRecipe,
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

    // Purges the whole next page cache, could potentially be refined
    revalidatePath("/", "layout");

    return { recipeID: id, imagePutURL };
  });

export const deleteRecipe = actionClient
  .schema(z.string())
  .action(async ({ parsedInput: id }) => {
    await serverDeleteRecipe(id);

    // Purges the whole next page cache, could potentially be refined
    revalidatePath("/", "layout");
  });
