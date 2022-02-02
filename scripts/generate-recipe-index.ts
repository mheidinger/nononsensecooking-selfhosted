/*import fs from "fs/promises";
import path from "path";
import { loadRecipesFromDisk } from "../lib/recipes";

const basePath = "./public/recipes";
const fieldsToIncludeInIndex = [
  "id",
  "name",
  "image",
  "cookTime",
  "diet",
  "slug",
  "publishedAt",
];

async function generateIndex() {
  const recipes = await loadRecipesFromDisk();
  const trimmedRecipes = recipes.map((recipe) =>
    Object.fromEntries(
      Object.entries(recipe).filter(([key, _]) =>
        fieldsToIncludeInIndex.includes(key)
      )
    )
  );
  console.log("   👀 Found", trimmedRecipes.length, "recipes");
  const targetFile = path.join(basePath, `index.json`);
  console.log("   📝 Writing to", targetFile);
  await fs.writeFile(targetFile, JSON.stringify(trimmedRecipes));
}

generateIndex().catch(console.error);*/
export {}
