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

const COLUMN_MAX_WIDTH = "1300px";

const EditRecipeDiv = styled.div`
	margin: auto;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  gap: 2rem;
  min-height: 80vh;
  max-width: 2000px;
  padding: 0 2rem;

  @media screen and (max-width: ${COLUMN_MAX_WIDTH}) {
    flex-direction: column;
  }
`;

const LeftSide = styled.div`
  flex-shrink: 1;
`;

const RightSide = styled.div`
  flex-grow: 1;
`;

const HorizontalLine = styled.hr`
  margin-top: 1.5rem;
  margin-bottom: -0.5rem;
  width: 90%;
  border: 1px solid;
  border-radius: 5px;
  background-color: black;
`;

const ColumnHorizontalLine = styled(HorizontalLine)`
  display: none;
  @media screen and (max-width: ${COLUMN_MAX_WIDTH}) {
    display: block;
  }
`;

const RowVerticalLine = styled.div`
  border: 1px solid;
  border-radius: 5px;
  background-color: black;

  @media screen and (max-width: ${COLUMN_MAX_WIDTH}) {
    display: none;
  }
`;

const SaveButton = styled(AddButton)`
  height: 2.8rem;
  font-size: 1.2rem;

  @media screen and (max-width: ${COLUMN_MAX_WIDTH}) {
    font-size: 1rem;
  }
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
      <ColumnHorizontalLine />
      <RowVerticalLine />
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
