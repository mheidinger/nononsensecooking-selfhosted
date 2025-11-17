import { cache } from "react";
import { fetchSingleRecipe } from "~/server/recipes";
import RecipePage from "./RecipePage";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const fetchRecipe = cache(fetchSingleRecipe);

export async function generateMetadata(props: Props) {
  const params = await props.params;
  const { id } = params;
  const recipe = await fetchRecipe(id);

  return {
    title: `${recipe.name} - NoNonsenseCooking`,
  };
}

async function getData(id: string) {
  const recipe = await fetchRecipe(id);

  return {
    recipe,
  };
}

export default async function Page(props: Props) {
  const { id } = await props.params;
  const data = await getData(id);

  return <RecipePage {...data} />;
}
