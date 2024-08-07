import { useTranslations } from "next-intl";
import { type Ingredient as IngredientModel } from "~/models/Ingredient";
import { isScalingUnit } from "~/models/Unit";

interface Props {
  ingredient: IngredientModel;
  servingsMultiplier: number;
}

export default function Ingredient({ ingredient, servingsMultiplier }: Props) {
  const t = useTranslations("recipe");
  const { name, amount, unit } = ingredient;
  const adjustedAmount =
    isScalingUnit(unit) && amount
      ? Math.round(amount * servingsMultiplier * 100) / 100
      : amount;

  return (
    <span>
      {t(`unit.${unit}`, { amount: adjustedAmount })} {name}
    </span>
  );
}
