import shuffle from "lodash/shuffle";
import sortBy from "lodash/sortBy";
import { fetchRecipes, invalidateCache } from "~/server/recipes";
import Home from "./Home";

interface Props {
  searchParams: Record<string, string | string[] | undefined>;
}

async function getData({ id, invalidate }: Props["searchParams"]) {
  if (invalidate === "true") {
    const finalId =
      Array.isArray(id) && id.length > 0
        ? id[0]
        : typeof id === "string"
          ? id
          : undefined;
    if (finalId) {
      invalidateCache(finalId);
    }
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
