export enum Unit {
  NONE = "none",
  GRAM = "g",
  KILOGRAM = "kg",
  PIECE = "pc",
  MILILITERS = "ml",
  LITERS = "l",
  TABLESPOONS = "tbsp",
  TEASPOONS = "tsp",
}

const NonScalingUnits = [Unit.NONE];

export function isScalingUnit(unit: Unit): boolean {
  return !NonScalingUnits.includes(unit);
}
