import { z } from "zod";
import { Diet } from "./Diet";
import { Ingredient } from "./Ingredient";
import { Servings } from "./Servings";

export const BaseRecipe = z.object({
  name: z.string().min(1),
  cookTime: z.number(),
  diet: Diet,
  steps: z.array(z.string()),
  ingredients: z.array(Ingredient),
  publishedAt: z.string(),
  source: z.string(),
  servings: Servings,
  tags: z.array(z.string()),
});

export type BaseRecipe = z.infer<typeof BaseRecipe>;

export const Recipe = BaseRecipe.extend({
  id: z.string(),
  imageUrl: z.string().nullable(),
});

export type Recipe = z.infer<typeof Recipe>;
