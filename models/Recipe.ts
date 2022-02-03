import { Ingredient } from "./Ingredient";

export interface Recipe {
  id: string;
  name: string;
  cookTime: number;
  diet: "meat" | "fish" | "vegetarian" | "vegan";
  steps: string[];
  ingredients: Ingredient[];
  publishedAt: string;
}

export interface RecipeFile {
  name: string;
  cookTime: number;
  diet: "meat" | "fish" | "vegetarian" | "vegan";
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

const fieldsToIncludeInIndex = [
  "id",
  "name",
  "image",
  "cookTime",
  "diet",
  "slug",
  "publishedAt",
];

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
