import { cache } from "react";
import { fetchSingleRecipe } from "~/server/recipes";
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

async function getData({ params }: Props) {
  const { id } = params;

  const recipe = await fetchRecipe(id);

  return {
    recipe,
  };
}

export default async function Page(props: Props) {
  const data = await getData(props);

  return <RecipePage {...data} />;
}
