import { z } from "zod";

export const Servings = z.object({
  count: z.number(),
  label: z.string().optional(),
});

export type Servings = z.infer<typeof Servings>;
