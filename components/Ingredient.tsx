import { useTranslation } from "react-i18next";
import { Ingredient as IngredientModel } from "../models/Ingredient";

const Ingredient = ({
  name,
  scales,
  unit,
  amount,
  servingsMultiplier,
}: IngredientModel & { servingsMultiplier: number }) => {
  const { t } = useTranslation("recipe");
  const adjustedAmount = scales
    ? Math.round(amount * servingsMultiplier * 100) / 100
    : amount;

  return (
    <span>
      {t(`unit.${unit}`, { amount: adjustedAmount })} {name}
    </span>
  );
};

export default Ingredient;
