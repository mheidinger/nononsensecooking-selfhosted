import { z } from "zod";

export const Diet = z.enum(["meat", "fish", "vegetarian", "vegan"]);

export type Diet = z.infer<typeof Diet>;
