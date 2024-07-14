import { z } from "zod";
import { Unit } from "./Unit";

export const Ingredient = z
  .object({
    name: z.string().min(1),
    amount: z.number().optional(),
    unit: Unit,
  })
  .refine(
    (data) => {
      // If unit is not None, then amount must be provided (not undefined)
      if (data.unit !== Unit.enum.none && data.amount === undefined) {
        return false; // Validation fails
      }
      return true; // Validation passes
    },
    {
      message: "Amount is required if unit is not None",
    },
  );

export type Ingredient = z.infer<typeof Ingredient>;
