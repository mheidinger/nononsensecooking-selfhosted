"use server";

import { type Recipe } from "./models/Recipe";
import { searchRecipes as serverSearchRecipes } from "./server/recipes";

export async function searchRecipes(searchTerm: string): Promise<Recipe[]> {
  return serverSearchRecipes(searchTerm);
}
