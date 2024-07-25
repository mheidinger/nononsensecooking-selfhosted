"use client";

import { type Ingredient as IngredientModel } from "~/models/Ingredient";
import Ingredient from "./Ingredient";

import { useState } from "react";
import { type Servings } from "~/models/Servings";
import styles from "./IngredientsList.module.css";
import ServingsChooser from "./ServingsChooser";

interface Props {
  ingredients: IngredientModel[];
  servings: Servings;
}

export default function IngredientsList({ ingredients, servings }: Props) {
  const [currentServingsCount, setServingsCount] = useState(servings.count);

  return (
    <>
      <ServingsChooser
        count={currentServingsCount}
        label={servings.label}
        onServingsCountChanged={setServingsCount}
      />
      <ul className={styles.list}>
        {ingredients?.map((ingredient) => (
          <li key={ingredient.name}>
            <Ingredient
              ingredient={ingredient}
              servingsMultiplier={currentServingsCount / servings.count}
            />
          </li>
        ))}
      </ul>
    </>
  );
}
