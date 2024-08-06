import shuffle from "lodash/shuffle";
import sortBy from "lodash/sortBy";
import { fetchRecipes } from "~/server/recipes";
import HomePage from "./HomePage";

async function getData() {
  const allRecipes = await fetchRecipes();
  // TODO: Cache this and refresh every day
  const recipesOfTheDay = shuffle(allRecipes).slice(0, 3);
  const latestRecipes = sortBy(allRecipes, (recipe) =>
    new Date(recipe.publishedAt).getTime(),
  ).slice(0, 3);

  return {
    recipesOfTheDay,
    latestRecipes,
  };
}

export default async function Page() {
  const data = await getData();

  return <HomePage {...data} />;
}
