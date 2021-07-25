import { SupportedLanguage } from "../models/Localized";
import { RecipeInIndex } from "../models/Recipe";
import { GoatcounterClient, TimeoutError } from "./goatCounterApiClient";
import { fetchRecipeIndex } from "./recipes";

// TODO: Read the max try count from the config
const maxTries = 3;

/**
 * Fetches the most popular recipes by exporting metrics from GoatCounter and summing up pagehits on recipe pages
 * @returns The recipes index entries for the 3 most popular recipes
 */
export async function fetchMostPopularRecipes(locale: SupportedLanguage) {
  const goatcounterApiKey = process.env.GOATCOUNTER_API_KEY;
  // TODO: Read the URL from the config
  const goatcounterBaseUrl = "https://analytics.nononsense.cooking";
  const goatcounterClient = new GoatcounterClient(
    goatcounterApiKey,
    goatcounterBaseUrl
  );

  return await withRetries(maxTries, async () => {
    const accumulatedPagehits =
      await goatcounterClient.fetchMostPopularRecipesForLocale(locale);
    const recipeIndex = await fetchRecipeIndex(locale);
    return (
      recipeIndex
        // .filter(excludeRecipesNotMatchingIds(Object.keys(accumulatedPagehits)))
        .sort(byNumberOfPageHits(accumulatedPagehits))
        .slice(0, 3)
    );
  });
}

/**
 * Sort function for a recipe index.
 * @param hits The accumulated page hits by id
 * @returns Recipe index sorted by descending amount of page hits and subsorted by the recipe names
 */
const byNumberOfPageHits =
  (hits: { [recipeId: string]: number }) =>
  (a: RecipeInIndex, b: RecipeInIndex) =>
    (hits[b.id] || 0) - (hits[a.id] || 0) || a.name.localeCompare(b.name);

const excludeRecipesNotMatchingIds =
  (ids: string[]) => (recipe: RecipeInIndex) =>
    ids.includes(recipe.id);

async function withRetries(maxTries: number, fn: Function) {
  for (let tries = 0; tries < maxTries; tries++) {
    try {
      return await fn();
    } catch (err) {
      // We don't need a stacktrace for timeouts
      if (err instanceof TimeoutError) {
        console.error(err.message);
      } else {
        console.error(err);
      }
      if (tries < maxTries - 1) {
        console.log("Retrying...");
      }
    }
  }

  throw new Error(
    "Maximum retries reached while getting most popular hits from GoatCounter"
  );
}
