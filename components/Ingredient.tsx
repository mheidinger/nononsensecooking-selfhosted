import { useTranslation } from "react-i18next";
import { Ingredient as IngredientModel } from "../models/Ingredient";

const Ingredient = ({
  id,
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
  const ingredientName = name ? name : id;

  return (
    <span>
      {t(`unit.${unit}`, { amount: adjustedAmount })} {ingredientName}
    </span>
  );
};

export default Ingredient;
