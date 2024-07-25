import { cache } from "react";
import { fetchSingleRecipe, invalidateCache } from "~/server/recipes";
import RemoveQueryParameter from "../../_components/RemoveQueryParameter";
import RecipePage from "./RecipePage";

interface Props {
  params: { id: string };
  searchParams: Record<string, string | string[] | undefined>;
}

const fetchRecipe = cache(fetchSingleRecipe);

export async function generateMetadata({ params }: Props) {
  const { id } = params;
  const recipe = await fetchRecipe(id);

  return {
    title: `${recipe.name} - NoNonsenseCooking`,
  };
}

async function getData({ searchParams, params }: Props) {
  const { id } = params;
  const { invalidate } = searchParams;
  if (invalidate === "true") {
    invalidateCache(id);
  }

  const recipe = await fetchRecipe(id);

  return {
    recipe,
  };
}

export default async function Page(props: Props) {
  const data = await getData(props);

  return (
    <>
      <RemoveQueryParameter parameter="invalidate" />
      <RecipePage {...data} />
    </>
  );
}
