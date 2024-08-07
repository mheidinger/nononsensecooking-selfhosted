"use client";

import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { nanoid } from "nanoid";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { type Ingredient as IngredientModel } from "~/models/Ingredient";
import { Unit } from "~/models/Unit";
import Button from "../inputs/Button";
import InputLabel from "../inputs/InputLabel";
import InputRow from "../inputs/InputRow";
import Ingredient from "./Ingredient";

interface Props {
  initialIngredients?: IngredientModel[];
  onIngredientsUpdated: (ingredients: IngredientModel[]) => void;
}

interface IngredientWithID {
  id: string;
  ingredient: IngredientModel;
}

export default function Ingredients({
  initialIngredients,
  onIngredientsUpdated,
}: Props) {
  const t = useTranslations("recipe");

  const [ingredients, setIngredients] = useState<IngredientWithID[]>([]);

  useEffect(() => {
    if (!initialIngredients) {
      setIngredients([
        { id: nanoid(), ingredient: { name: "", unit: Unit.enum.none } },
      ]);
    } else {
      setIngredients(
        initialIngredients.map((ingredient) => ({ id: nanoid(), ingredient })),
      );
    }
  }, [initialIngredients, setIngredients]);

  useEffect(() => {
    onIngredientsUpdated(ingredients.map(({ ingredient }) => ingredient));
  }, [ingredients, onIngredientsUpdated]);

  function updateIngredient(id: string, newIngredient: IngredientModel) {
    setIngredients(function (prevIngredients) {
      return prevIngredients.map((item) =>
        item.id === id ? { ...item, ingredient: newIngredient } : item,
      );
    });
  }

  function addIngredient() {
    setIngredients((prevIngredients) => [
      ...prevIngredients,
      { id: nanoid(), ingredient: { name: "", unit: Unit.enum.none } },
    ]);
  }

  function removeIngredient(id: string) {
    setIngredients((prevIngredients) =>
      prevIngredients.filter((item) => item.id !== id),
    );
  }

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const oldIndex = ingredients.findIndex(
          (ingredient) => ingredient.id === active.id,
        );
        const newIndex = ingredients.findIndex(
          (ingredient) => ingredient.id === over.id,
        );

        const newIngredients = Array.from(ingredients);
        const [reorderedIngredient] = newIngredients.splice(oldIndex, 1);
        newIngredients.splice(newIndex, 0, reorderedIngredient!);

        setIngredients(newIngredients);
      }
    },
    [ingredients],
  );

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <InputRow headingRow>
        <InputLabel>{t("edit.ingredients")}</InputLabel>
      </InputRow>
      <SortableContext items={ingredients}>
        {ingredients.map(({ id, ingredient }, index) => (
          <Ingredient
            key={id}
            id={id}
            index={index}
            ingredient={ingredient}
            updateIngredient={(newIngredient) =>
              updateIngredient(id, newIngredient)
            }
            removeIngredient={() => removeIngredient(id)}
          />
        ))}
      </SortableContext>

      <InputRow>
        <Button variant="add" onClick={addIngredient}>
          {t("edit.addIngredient")}
        </Button>
      </InputRow>
    </DndContext>
  );
}
