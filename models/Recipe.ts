import { Ingredient } from "./Ingredient";

export enum Diet {
  Meat = "meat",
  Fish = "fish",
  Vegetarian = "vegetarian",
  Vegan = "vegan",
}

export interface Recipe {
  id: string;
  name: string;
  cookTime: number;
  diet: Diet;
  steps: string[];
  ingredients: Ingredient[];
  publishedAt: string;
  source: string;
  servings: Servings;
  tags: string[];
}

export interface Servings {
  count: number;
  label?: string;
}

export interface RecipeFile {
  name: string;
  cookTime: number;
  diet: Diet;
  steps: string[];
  ingredients: Ingredient[];
  publishedAt: string;
  source: string;
  servings: {
    count: number;
    label?: string;
  };
  tags: string[];
}

export type RecipeInIndex = Pick<
  Recipe,
  "id" | "name" | "cookTime" | "diet" | "publishedAt" | "tags"
> & {
  s3Url?: string;
};

export function toRecipeInIndex({
  id,
  name,
  cookTime,
  diet,
  publishedAt,
  tags,
}: Recipe): RecipeInIndex {
  return {
    id,
    name,
    cookTime,
    diet,
    publishedAt,
    tags,
  };
}
