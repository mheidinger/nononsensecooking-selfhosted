import { type Ingredient as IngredientModel } from "~/models/Ingredient";
import Ingredient from "./Ingredient";
import styles from "./IngredientsList.module.css";

interface Props {
  ingredients: IngredientModel[];
  servingsMultiplier: number;
}

const IngredientsList = ({ ingredients, servingsMultiplier }: Props) => (
  <div>
    <ul className={styles.list}>
      {ingredients?.map((ingredient) => (
        <li key={ingredient.name}>
          <Ingredient
            ingredient={ingredient}
            servingsMultiplier={servingsMultiplier}
          />
        </li>
      ))}
    </ul>
  </div>
);

export default IngredientsList;
