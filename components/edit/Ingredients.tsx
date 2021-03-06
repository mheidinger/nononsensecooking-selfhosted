import { useTranslation } from "next-i18next";
import { Ingredient } from "../../models/Ingredient";
import { Unit } from "../../models/Unit";
import { AddButton, GroupedInput, Input, InputLabel, InputRow, Select, RemoveButton } from "../Inputs";
import Icon from "@mdi/react";
import { mdiClose, mdiDrag } from "@mdi/js";
import { useCallback, useMemo } from "react";
import { useDnD } from "./DnD";

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
    const options: JSX.Element[] = [];
    for (const unit in Unit) {
      options.push(<option value={Unit[unit]} key={Unit[unit]}>{tr(`unit.${Unit[unit]}`, {amount: ""}).trim()}</option>)
    }
    return options;
  }, [tr]);

  const onDrop = useCallback((sourceIndex: number, targetIndex: number) => {
    const [removed] = ingredients.splice(sourceIndex, 1);
    ingredients.splice(targetIndex, 0, removed);
    setIngredients(ingredients);
  }, [ingredients, setIngredients]);

  const toDnDProps = useDnD({
    contextName: "ingredients",
    hoverClass: "dragHover",
    onDrop,
  });

  return (
    <>
      <InputRow headingRow><InputLabel>{tr("edit.ingredients")}</InputLabel></InputRow>
      {ingredients.map((ingredient, index) =>
        <InputRow key={`ingredient${index}`}>
          <GroupedInput
            {...toDnDProps(index)}
          >
            <Icon path={mdiDrag} size={1.4} />
            <Input
              name={`ingredient${index}Amount`}
              value={ingredient.amount && ingredient.unit !== Unit.NONE ? ingredient.amount : ""}
              disabled={ingredient.unit === Unit.NONE}
              onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
              onChange={(event) => {
                if (event.target.value.length > 0) {
                  setIngredient({...ingredient, amount: parseInt(event.target.value)}, index);
                } else {
                  setIngredient({...ingredient, amount: undefined}, index);
                }
              }}
              width="20%"
            />
            <Select
              id={`ingredient${index}Unit`}
              value={ingredient.unit ? ingredient.unit : Unit.NONE}
              onChange={event => setIngredient({...ingredient, unit: event.target.value as Unit}, index)}
              width="20%"
            >
              {unitOptions}
            </Select>
            <Input
              name={`ingredient${index}Name`}
              value={ingredient.name}
              onChange={event => setIngredient({...ingredient, name: event.target.value}, index)}
              width="60%"
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
