import { fetchRecipes, invalidateCache } from "~/server/recipes";
import shuffle from "lodash/shuffle";
import sortBy from "lodash/sortBy";
import Home from "./Home";

interface SearchParams {
  id?: string;
  invalidate?: string;
}

interface Props {
  searchParams: SearchParams;
}

async function getData({ id, invalidate }: SearchParams) {
  if (id && invalidate === "true") {
    invalidateCache(id);
  }
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

export default async function Page({ searchParams }: Props) {
  const data = await getData(searchParams);

  return <Home {...data} />;
}
