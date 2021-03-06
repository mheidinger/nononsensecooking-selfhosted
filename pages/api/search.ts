import Fuse from "fuse.js";
import { NextApiRequest, NextApiResponse } from "next";
import { fetchRecipeIndex } from "../../lib/recipes";
import { methodIs } from "./utils/methodIs";

const searchOptions = {
  isCaseSensitive: false,
  includeScore: true,
  includeMatches: false,
  findAllMatches: false,
  minMatchCharLength: 2,
  threshold: 0.4,
  distance: 100,
  useExtendedSearch: false,
  ignoreLocation: false,
  ignoreFieldNorm: false,
  shouldSort: true,
  keys: ["name"],
  fieldNormWeight: 0,
};

export function sanitize(term: string) {
  return term.trim().replace(/[<>]/g, "");
}

export async function searchRecipes(
  searchTerm: string
) {
  const recipes = await fetchRecipeIndex();
  const fuse = new Fuse(recipes, searchOptions);

  return fuse.search(sanitize(searchTerm));
}

export default async function search(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!methodIs(["GET"], req, res)) return;
  const { query } = req.query;
  res.status(200).json(await searchRecipes(query as string));
}
