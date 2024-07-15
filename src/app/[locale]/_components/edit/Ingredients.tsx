"use client";

import { mdiClose, mdiDrag } from "@mdi/js";
import Icon from "@mdi/react";
import { useTranslations } from "next-intl";
import { useCallback, useMemo } from "react";
import { type Ingredient } from "~/models/Ingredient";
import { Unit } from "~/models/Unit";
import Button from "../inputs/Button";
import GroupedInput from "../inputs/GroupedInput";
import Input from "../inputs/Input";
import InputLabel from "../inputs/InputLabel";
import InputRow from "../inputs/InputRow";
import Select from "../inputs/Select";
import { useDnD } from "./useDnD";

type Props = {
  ingredients: Ingredient[];
  setIngredients(ingredients: Ingredient[]): void;
};

export default function Ingredients({ ingredients, setIngredients }: Props) {
  const t = useTranslations("recipe");

  function setIngredient(ingredient: Ingredient, index: number) {
    ingredients[index] = ingredient;
    setIngredients(ingredients);
  }

  function removeIngredient(index: number) {
    ingredients.splice(index, 1);
    setIngredients(ingredients);
  }

  const unitOptions = useMemo(() => {
    return Unit.options.map((option) => (
      <option value={option} key={option}>
        {t(`unit.${option}`, { amount: "" }).trim()}
      </option>
    ));
  }, [t]);

  const onDrop = useCallback(
    (sourceIndex: number, targetIndex: number) => {
      const [removed] = ingredients.splice(sourceIndex, 1);
      if (!removed) {
        return;
      }
      ingredients.splice(targetIndex, 0, removed);
      setIngredients(ingredients);
    },
    [ingredients, setIngredients],
  );

  const toDnDProps = useDnD({
    contextName: "ingredients",
    hoverClass: "dragHover",
    onDrop,
  });

  return (
    <>
      <InputRow headingRow>
        <InputLabel>{t("edit.ingredients")}</InputLabel>
      </InputRow>
      {ingredients.map((ingredient, index) => (
        <InputRow key={`ingredient${index}`}>
          <GroupedInput {...toDnDProps(index)}>
            <Icon path={mdiDrag} size={1.4} />
            <Input
              name={`ingredient${index}Amount`}
              value={
                ingredient.amount && ingredient.unit !== Unit.enum.none
                  ? ingredient.amount
                  : ""
              }
              disabled={ingredient.unit === Unit.enum.none}
              onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
              onChange={(event) => {
                if (event.currentTarget.value.length > 0) {
                  setIngredient(
                    {
                      ...ingredient,
                      amount: parseInt(event.currentTarget.value),
                    },
                    index,
                  );
                } else {
                  setIngredient({ ...ingredient, amount: undefined }, index);
                }
              }}
              width="20%"
            />
            <Select
              id={`ingredient${index}Unit`}
              value={ingredient.unit ?? Unit.enum.none}
              onChange={(event) =>
                setIngredient(
                  { ...ingredient, unit: event.currentTarget.value as Unit },
                  index,
                )
              }
              width="20%"
            >
              {unitOptions}
            </Select>
            <Input
              name={`ingredient${index}Name`}
              value={ingredient.name}
              onChange={(event) =>
                setIngredient(
                  { ...ingredient, name: event.currentTarget.value },
                  index,
                )
              }
              width="60%"
            />
            <Button variant="remove" onClick={() => removeIngredient(index)}>
              <Icon path={mdiClose} size={0.8} />
            </Button>
          </GroupedInput>
        </InputRow>
      ))}
      <InputRow>
        <Button
          variant="add"
          onClick={() =>
            setIngredients([...ingredients, { name: "", unit: Unit.enum.none }])
          }
        >
          {t("edit.addIngredient")}
        </Button>
      </InputRow>
    </>
  );
}
