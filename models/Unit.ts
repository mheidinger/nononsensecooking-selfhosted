import { z } from "zod";

export const Unit = z.enum(["none", "g", "kg", "pc", "ml", "l", "tbsp", "tsp"]);

export type Unit = z.infer<typeof Unit>;

export function isScalingUnit(unit: Unit): boolean {
  return unit !== Unit.enum.none;
}
