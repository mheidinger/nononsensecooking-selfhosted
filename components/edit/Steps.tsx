import { useTranslation } from "next-i18next";
import { useEffect, useRef } from "react";
import { Recipe } from "../../models/Recipe";
import { AddButton, GroupedInput, InputLabel, InputRow, RemoveButton, StepInput } from "./Inputs";
import autosize from "autosize";
import Icon from "@mdi/react";
import { mdiClose } from "@mdi/js";

type Props = {
  recipe: Recipe;
  setRecipe(recipe: Recipe): void;
};

const Steps = ({recipe, setRecipe}: Props) => {
  const { t: tr } = useTranslation("recipe");
  const textAreaRefs = useRef([]);

  useEffect(() => {
    for (const ref of textAreaRefs.current) {
      autosize(ref);
    }
  }, [recipe.steps]);

  function setStep(step: string, index: number) {
    recipe.steps[index] = step;
    setRecipe({...recipe});
  };

  function removeStep(index: number) {
    recipe.steps.splice(index, 1);
    setRecipe({...recipe});
  };

  return (
    <>
      <InputRow headingRow><InputLabel>{tr("edit.steps")}</InputLabel></InputRow>
      {recipe.steps.map((step, index) =>
        <InputRow key={`step${index}`}>
          <InputLabel indent>#{index+1}:</InputLabel>
          <GroupedInput>
            <StepInput
              name={`step${index}`}
              value={step}
              onChange={event => setStep(event.target.value, index)}
              ref={ref => {
                textAreaRefs.current[index] = ref;
              }}
            />
            <RemoveButton onClick={() => removeStep(index)}>
              <Icon path={mdiClose} size={0.8} />
            </RemoveButton>
          </GroupedInput>
        </InputRow>)
      }
      <InputRow><AddButton
        onClick={() => setRecipe({...recipe, steps: [...recipe.steps, ""]})}
      >
        {tr("edit.addStep")}
      </AddButton></InputRow>
    </>
  );
};

export default Steps;
