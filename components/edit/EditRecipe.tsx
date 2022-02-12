import { useTranslation } from "next-i18next";
import { useCallback } from "react";
import styled from "styled-components";
import { Ingredient } from "../../models/Ingredient";
import { Recipe } from "../../models/Recipe";
import { StyledHeading } from "../StyledHeading";
import GeneralInformation from "./GeneralInformation";
import Ingredients from "./Ingredients";
import Steps from "./Steps";

type Props = {
  recipe: Recipe;
  setRecipe(recipe: Recipe): void;
};

const EditRecipeDiv = styled.div`
  max-width: 1000px;
  width: 100%;
  margin: 2rem auto;
  padding: 0 2rem;
  box-sizing: border-box;
`;

const HorizontalLine = styled.hr`
  margin-top: 1.5rem;
  margin-bottom: -0.5rem;
  width: 90%;
  border: 1px solid;
  border-radius: 5px;
  background-color: black;
`;

const EditRecipe = ({recipe, setRecipe}: Props) => {
  const { t } = useTranslation("common");

  const setIngredients = useCallback((ingredients: Ingredient[]) => {
    setRecipe({...recipe, ingredients});
  }, [recipe, setRecipe]);
  const setSteps = useCallback((steps: string[]) => {
    setRecipe({...recipe, steps});
  }, [recipe, setRecipe]);

  return (
    <EditRecipeDiv>
      <StyledHeading>{t("create.displaytitle")}</StyledHeading>
      <GeneralInformation
        recipe={recipe}
        setRecipe={setRecipe}
      />
      <HorizontalLine />
      <Ingredients
        ingredients={recipe.ingredients}
        setIngredients={setIngredients}
      />
      <HorizontalLine />
      <Steps
        steps={recipe.steps}
        setSteps={setSteps}
      />
    </EditRecipeDiv>
  );
};

export default EditRecipe;
