import { useCallback } from "react";
import styled from "styled-components";
import { Ingredient } from "../../models/Ingredient";
import { Recipe } from "../../models/Recipe";
import { StyledHeading } from "../StyledHeading";
import GeneralInformation from "./GeneralInformation";
import Ingredients from "./Ingredients";
import { AddButton, InputRow } from "./Inputs";
import Steps from "./Steps";

type Props = {
  title: string;
  recipe: Recipe;
  setRecipe(recipe: Recipe): void;
  saveRecipe(): void;
  setRecipeImageFile(file?: File): void;
};

const EditRecipeDiv = styled.div`
  margin: 3rem;
  padding: 0 2rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 2rem;
  min-height: 80vh;
`;

const LeftSide = styled.div`
  min-width: 400px;
`;

const RightSide = styled.div`
  flex-grow: 1;
  min-width: 400px;
`;

const HorizontalLine = styled.hr`
  margin-top: 1.5rem;
  margin-bottom: -0.5rem;
  width: 90%;
  border: 1px solid;
  border-radius: 5px;
  background-color: black;
`;

const VerticalLine = styled.div`
  border: 1px solid;
  border-radius: 5px;
  background-color: black;

  @media screen and (max-width: 1000px) {
    display: none
  }
`;

const SaveButton = styled(AddButton)`
  height: 2.5rem;
  font-size: 1.2rem;
`;

const EditRecipe = ({title, recipe, setRecipe, saveRecipe, setRecipeImageFile}: Props) => {
  const setIngredients = useCallback((ingredients: Ingredient[]) => {
    setRecipe({...recipe, ingredients});
  }, [recipe, setRecipe]);
  const setSteps = useCallback((steps: string[]) => {
    setRecipe({...recipe, steps});
  }, [recipe, setRecipe]);

  return (
    <EditRecipeDiv>
      <LeftSide>
        <InputRow>
          <StyledHeading>{title}</StyledHeading>
          <SaveButton onClick={saveRecipe}>Save Recipe</SaveButton>
        </InputRow>
        <GeneralInformation
          recipe={recipe}
          setRecipe={setRecipe}
          setRecipeImageFile={setRecipeImageFile}
        />
        <HorizontalLine />
        <Ingredients
          ingredients={recipe.ingredients}
          setIngredients={setIngredients}
        />
      </LeftSide>
      <VerticalLine />
      <RightSide>
        <Steps
          steps={recipe.steps}
          setSteps={setSteps}
        />
      </RightSide>
    </EditRecipeDiv>
  );
};

export default EditRecipe;
