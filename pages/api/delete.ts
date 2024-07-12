import { NextApiRequest, NextApiResponse } from "next";
import { deleteRecipe } from "../../lib/recipes";
import { methodIs } from "./utils/methodIs";

export default async function delRecipe(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!methodIs(["DELETE"], req, res)) return;

  if (!req.body.id || typeof req.body.id !== "string" || req.body.id === "") {
    res.status(400).json({ message: "id not found in request body" });
    return;
  }

  try {
    deleteRecipe(req.body.id);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
