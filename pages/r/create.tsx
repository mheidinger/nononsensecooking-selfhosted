import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import PageTitle from "../../components/PageTitle";
import { StyledHeading } from "../../components/StyledHeading";
import { Ingredient } from "../../models/Ingredient";
import { Diet, Recipe } from "../../models/Recipe";
import { Unit } from "../../models/Unit";
import autosize from "autosize";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "header", "footer", "recipe"])),
    },
  };
};

const initRecipe: Recipe = {
  id: "",
  name: "New Recipe",
  diet: Diet.Meat,
  cookTime: 20,
  publishedAt: "",
  ingredients: [{name: ""}],
  steps: [""]
};

const CreateRecipeDiv = styled.div`
  max-width: 1000px;
  width: 100%;
  margin: 2rem auto;
  padding: 0 2rem;
  box-sizing: border-box;
`;

const InputRow = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 2rem;
  width: 100%;
`;

const InputLabel = styled.label`
  font-size: 1.2rem;
  font-weight: 600;
  margin: auto 0;
`;

const Input = styled.input`
  font-family: var(--font-stack);
  font-size: var(--font-size-base);
  background: var(--color-background-alt);
  border-radius: var(--rounded);
  border: none;
  padding: 0.75rem 1rem;
  appearance: none;
  color: var(--color-text-primary);
  width: ${props => props.width || "70%"};
  height: 3rem;
`;

const Select = styled.select<{width?: string} & React.HTMLProps<HTMLSelectElement>>`
  font-family: var(--font-stack);
  font-size: var(--font-size-base);
  background: var(--color-background-alt);
  border-radius: var(--rounded);
  border: none;
  padding: 0.75rem 1rem;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
  color: var(--color-text-primary);
  width: ${props => props.width || "70%"};
  height: 3rem;
`;

const IngredientInput = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  width: 70%;
  min-width: 400px;
`

const AddButton = styled.button`
  background: var(--color-primary);
  height: 3rem;
  appearance: none;
  cursor: pointer;
  border-radius: var(--rounded);
  outline: none;
  border: none;
  color: hsla(var(--palette-gray-00), 100%);
  font-size: 1.2rem;
  font-weight: 400;
  padding: 0 1rem;
`;

const StepInput = styled.textarea`
  font-family: var(--font-stack);
  font-size: var(--font-size-base);
  background: var(--color-background-alt);
  border-radius: var(--rounded);
  border: none;
  padding: 0.75rem 1rem;
  appearance: none;
  color: var(--color-text-primary);
  width: 70%;
`;

//TODO: Translate
export default function CreateRecipe({}: InferGetStaticPropsType<
  typeof getStaticProps
>) {
  const { t } = useTranslation("common");
  const { t: tr } = useTranslation("recipe");
  const [ recipe, setRecipe ] = useState(initRecipe);
  const textAreaRefs = useRef([]);

  useEffect(() => {
    for (const ref of textAreaRefs.current) {
      autosize(ref);
    }
  }, [recipe.steps]);

  function setIngredient(ingredient: Ingredient, index: number) {
    recipe.ingredients[index] = ingredient;
    setRecipe({...recipe});
  }

  function setStep(step: string, index: number) {
    recipe.steps[index] = step;
    setRecipe({...recipe});
  }

  const dietOptions = [];
  for (const diet in Diet) {
    dietOptions.push(<option value={Diet[diet]} key={Diet[diet]}>{diet}</option>)
  }

  const unitOptions = [];
  for (const unit in Unit) {
    unitOptions.push(<option value={Unit[unit]} key={Unit[unit]}>{tr(`unit.${Unit[unit]}`)}</option>)
  }

  return (
    <>
      <PageTitle title={t("create.pagetitle")} />
      <CreateRecipeDiv>
        <StyledHeading>{t("create.displaytitle")}</StyledHeading>
        <InputRow>
          <InputLabel>Name: </InputLabel>
          <Input
            name="recipeName"
            value={recipe.name}
            onChange={event => setRecipe({...recipe, name: event.target.value})}
          />
        </InputRow>
        <InputRow>
          <InputLabel>Diet: </InputLabel>
          <Select
            id="recipeDiet"
            value={recipe.diet}
            onChange={event => setRecipe({...recipe, diet: event.target.value as Diet})}
          >
            {dietOptions}
          </Select>
        </InputRow>
        <InputRow>
          <InputLabel>Cook Time (in min): </InputLabel>
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
        <div>
          {recipe.ingredients.map((ingredient, index) =>
            <InputRow key={`ingredient${index}`}>
              <InputLabel>Ingredient #{index+1}:</InputLabel>
              <IngredientInput>
                <Input
                  name={`ingredient${index}Amount`}
                  width="20%"
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
                  width="20%"
                  value={ingredient.unit ? ingredient.unit : Unit.NONE}
                  onChange={event => setIngredient({...ingredient, unit: event.target.value as Unit}, index)}
                >
                  {unitOptions}
                </Select>
                <Input
                  name={`ingredient${index}Name`}
                  width="80%"
                  value={ingredient.name}
                  onChange={event => setIngredient({...ingredient, name: event.target.value}, index)}
                />
              </IngredientInput>
            </InputRow>)
          }
          <InputRow><AddButton
            onClick={(_) => setRecipe({...recipe, ingredients: [...recipe.ingredients, {name: ""}]})}
          >
            Add Ingredient
          </AddButton></InputRow>
        </div>
        <div>
          {recipe.steps.map((step, index) =>
            <InputRow key={`step${index}`}>
              <InputLabel>Step #{index+1}:</InputLabel>
              <StepInput
                name={`step${index}`}
                value={step}
                onChange={event => setStep(event.target.value, index)}
                ref={ref => {
                  textAreaRefs.current[index] = ref;
                }}
              />
            </InputRow>)
          }
          <InputRow><AddButton
            onClick={(_) => setRecipe({...recipe, steps: [...recipe.steps, ""]})}
          >
            Add Step
          </AddButton></InputRow>
        </div>
      </CreateRecipeDiv>
    </>
  );
}
