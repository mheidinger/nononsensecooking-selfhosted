import { NextApiRequest, NextApiResponse } from "next";
import slug from "slug";
import { createRecipe } from "../../lib/recipes";
import { BaseRecipe, Recipe } from "../../models/Recipe";
import { methodIs } from "./utils/methodIs";
import { ZodError } from "zod";

export default async function create(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!methodIs(["POST", "PUT"], req, res)) return;

  try {
    const baseRecipe = BaseRecipe.parse(req.body);
    const id = req.body.id || slug(baseRecipe.name);
    const imagePutURL = await createRecipe(
      id,
      baseRecipe,
      req.method === "PUT",
    );
    res.status(200).json({ recipeID: id, imagePutURL: imagePutURL });
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }));
      const errorMessage = errors
        .map((e) => `${e.path}: ${e.message}`)
        .join(", ");
      res.status(400).json({ message: errorMessage });
      return;
    }
    res.status(500).json({ message: error.message });
  }
}
