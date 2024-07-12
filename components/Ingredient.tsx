import { useTranslation } from "next-i18next";
import { Ingredient as IngredientModel } from "../models/Ingredient";
import { isScalingUnit } from "../models/Unit";

const Ingredient = ({
  name,
  unit,
  amount,
  servingsMultiplier,
}: IngredientModel & { servingsMultiplier: number }) => {
  const { t } = useTranslation("recipe");
  const adjustedAmount =
    isScalingUnit(unit) && amount
      ? Math.round(amount * servingsMultiplier * 100) / 100
      : amount;

  return (
    <span>
      {t(`unit.${unit}`, { amount: adjustedAmount })} {name}
    </span>
  );
};

export default Ingredient;
