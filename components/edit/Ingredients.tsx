import { useTranslation } from "next-i18next";
import { Recipe } from "../../models/Recipe";
import { Ingredient } from "../../models/Ingredient";
import { Unit } from "../../models/Unit";
import { AddButton, GroupedInput, Input, InputLabel, InputRow, Select, RemoveButton } from "./Inputs";
import Icon from "@mdi/react";
import { mdiClose, mdiDrag } from "@mdi/js";
import { useState, DragEvent } from "react";

type Props = {
  recipe: Recipe;
  setRecipe(recipe: Recipe): void;
};

const Ingredients = ({recipe, setRecipe}: Props) => {
  const { t: tr } = useTranslation("recipe");

  function setIngredient(ingredient: Ingredient, index: number) {
    recipe.ingredients[index] = ingredient;
    setRecipe({...recipe});
  }

  function removeIngredient(index: number) {
    recipe.ingredients.splice(index, 1);
    setRecipe({...recipe});
  }

  const unitOptions = [];
  for (const unit in Unit) {
    unitOptions.push(<option value={Unit[unit]} key={Unit[unit]}>{tr(`unit.${Unit[unit]}`)}</option>)
  }

  function onDragStart(event: DragEvent<HTMLDivElement>, index: number) {
    event.dataTransfer.setData("number", index.toString());
    event.dataTransfer.effectAllowed = "all";
  }

  function onDrop(event: DragEvent<HTMLDivElement>, targetIndex: number) {
    event.preventDefault();

    const sourceIndex = parseInt(event.dataTransfer.getData("number"));
    const [removed] = recipe.ingredients.splice(sourceIndex, 1);
    recipe.ingredients.splice(targetIndex, 0, removed);
    setRecipe({ ...recipe });
  }

  function onDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }

  return (
    <>
      <InputRow headingRow><InputLabel>{tr("edit.ingredients")}</InputLabel></InputRow>
      {recipe.ingredients.map((ingredient, index) =>
        <InputRow key={`ingredient${index}`}>
          <div />
          <GroupedInput
          	id={`ingredientDrop_${index}`}
            draggable={true}
            onDragOver={onDragOver}
            onDragStart={(event) => onDragStart(event, index)}
            onDrop={(event) => onDrop(event, index)}
          >
            <Icon path={mdiDrag} size={1.4} />
            <Input
              name={`ingredient${index}Amount`}
              width="10%"
              value={ingredient.amount}
              onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
              onChange={(event) => {
                if (event.target.value.length > 0) {
                  setIngredient({...ingredient, amount: parseInt(event.target.value)}, index);
                } else {
                  setIngredient({...ingredient, amount: 0}, index);
                }
              }}
            />
            <Select
              id={`ingredient${index}Unit`}
              width="15%"
              value={ingredient.unit ? ingredient.unit : Unit.NONE}
              onChange={event => setIngredient({...ingredient, unit: event.target.value as Unit}, index)}
            >
              {unitOptions}
            </Select>
            <Input
              name={`ingredient${index}Name`}
              width="60%"
              value={ingredient.name}
              onChange={event => setIngredient({...ingredient, name: event.target.value}, index)}
            />
            <RemoveButton onClick={event => removeIngredient(index)}>
              <Icon path={mdiClose} size={0.8} />
            </RemoveButton>
          </GroupedInput>
        </InputRow>)
      }
      <InputRow><AddButton
        onClick={() => setRecipe({...recipe, ingredients: [...recipe.ingredients, {name: ""}]})}
      >
        {tr("edit.addIngredient")}
      </AddButton></InputRow>
    </>
  );
}

export default Ingredients;
