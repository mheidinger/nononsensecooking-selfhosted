import { useTranslation } from "next-i18next";
import { useMemo } from "react";
import { Diet, Recipe } from "../../models/Recipe";
import { InputLabel, InputRow, Input, Select } from "./Inputs";

type Props = {
  recipe: Recipe;
  setRecipe(recipe: Recipe): void;
};

const GeneralInformation = ({recipe, setRecipe}: Props) => {
  const { t: tr } = useTranslation("recipe");

  const dietOptions = useMemo(() => {
    const options: JSX.Element[] = [];
    for (const diet in Diet) {
      options.push(<option value={Diet[diet]} key={Diet[diet]}>{diet}</option>)
    }
    return options;
  }, []);

  return (
    <>
      <InputRow>
        <InputLabel>{tr("edit.name")}</InputLabel>
        <Input
          name="recipeName"
          value={recipe.name}
          onChange={event => setRecipe({...recipe, name: event.target.value})}
        />
      </InputRow>
      <InputRow>
        <InputLabel>{tr("edit.diet")}</InputLabel>
        <Select
          id="recipeDiet"
          value={recipe.diet}
          onChange={event => setRecipe({...recipe, diet: event.target.value as Diet})}
        >
          {dietOptions}
        </Select>
      </InputRow>
      <InputRow>
        <InputLabel>{tr("edit.cookTime")}</InputLabel>
        <Input
          name="recipeCookTime"
          value={recipe.cookTime}
          onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
          onChange={(event) => {
            if (event.target.value.length > 0) {
              setRecipe({...recipe, cookTime: parseInt(event.target.value)});
            } else {
              setRecipe({...recipe, cookTime: 0});
            }
          }}
        />
      </InputRow>
    </>
  );
}

export default GeneralInformation;
