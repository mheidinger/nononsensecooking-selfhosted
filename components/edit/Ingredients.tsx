import { useTranslation } from "next-i18next";
import { Ingredient } from "../../models/Ingredient";
import { Unit } from "../../models/Unit";
import { AddButton, GroupedInput, Input, InputLabel, InputRow, Select, RemoveButton } from "./Inputs";
import Icon from "@mdi/react";
import { mdiClose, mdiDrag } from "@mdi/js";
import { DragEvent, useCallback, useMemo } from "react";

type Props = {
  ingredients: Ingredient[];
  setIngredients(ingredients: Ingredient[]): void;
};

const Ingredients = ({ingredients, setIngredients}: Props) => {
  const { t: tr } = useTranslation("recipe");

  function setIngredient(ingredient: Ingredient, index: number) {
    ingredients[index] = ingredient;
    setIngredients(ingredients);
  }

  function removeIngredient(index: number) {
    ingredients.splice(index, 1);
    setIngredients(ingredients);
  }

  const unitOptions = useMemo(() => {
    const options = [];
    for (const unit in Unit) {
      options.push(<option value={Unit[unit]} key={Unit[unit]}>{tr(`unit.${Unit[unit]}`)}</option>)
    }
    return options;
  }, [tr]);

  const onDragStart = useCallback((event: DragEvent<HTMLDivElement>, index: number) => {
    event.dataTransfer.setData("number", index.toString());
    event.dataTransfer.effectAllowed = "move";
  }, []);

  const onDrop = useCallback((event: DragEvent<HTMLDivElement>, targetIndex: number) => {
    event.preventDefault();

    const sourceIndex = parseInt(event.dataTransfer.getData("number"));
    const [removed] = ingredients.splice(sourceIndex, 1);
    ingredients.splice(targetIndex, 0, removed);
    setIngredients(ingredients);
  }, [ingredients, setIngredients]);

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  return (
    <>
      <InputRow headingRow><InputLabel>{tr("edit.ingredients")}</InputLabel></InputRow>
      {ingredients.map((ingredient, index) =>
        <InputRow key={`ingredient${index}`}>
          <GroupedInput
            draggable={true}
            onDragOver={onDragOver}
            onDragStart={(event) => onDragStart(event, index)}
            onDrop={(event) => onDrop(event, index)}
            width="100%"
          >
            <Icon path={mdiDrag} size={1.4} />
            <Input
              name={`ingredient${index}Amount`}
              width="10%"
              value={ingredient.amount && ingredient.unit !== Unit.NONE ? ingredient.amount : ""}
              disabled={ingredient.unit === Unit.NONE}
              onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
              onChange={(event) => {
                if (event.target.value.length > 0) {
                  setIngredient({...ingredient, amount: parseInt(event.target.value)}, index);
                } else {
                  setIngredient({...ingredient, amount: null}, index);
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
            <RemoveButton onClick={() => removeIngredient(index)}>
              <Icon path={mdiClose} size={0.8} />
            </RemoveButton>
          </GroupedInput>
        </InputRow>)
      }
      <InputRow><AddButton
        onClick={() => setIngredients([...ingredients, {name: "", unit: Unit.NONE}])}
      >
        {tr("edit.addIngredient")}
      </AddButton></InputRow>
    </>
  );
}

export default Ingredients;
