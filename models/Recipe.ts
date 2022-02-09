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
}

export interface RecipeFile {
  name: string;
  cookTime: number;
  diet: Diet;
  steps: string[];
  ingredients: Ingredient[];
  publishedAt: string;
}

export type RecipeInIndex = Pick<
  Recipe,
  | "id"
  | "name"
  | "cookTime"
  | "diet"
  | "publishedAt"
> & {
  s3Url?: string
};

export function toRecipeInIndex(
  {id, name, cookTime, diet, publishedAt}: Recipe,
): RecipeInIndex {
  return {
    id,
    name,
    cookTime,
    diet,
    publishedAt
  }
}
