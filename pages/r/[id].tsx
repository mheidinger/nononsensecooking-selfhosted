import { mdiClockOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";
import { useState } from "react";
import styled from "styled-components";
import IconForDiet from "../../components/IconForDiet";
import IngredientsList from "../../components/IngredientsList";
import PageTitle from "../../components/PageTitle";
import ServingsChooser from "../../components/ServingsChooser";
import StepList from "../../components/StepList";
import {
  fetchSingleRecipe,
} from "../../lib/recipes";
import { Recipe } from "../../models/Recipe";

export const getServerSideProps: GetServerSideProps<Recipe> = async (context) => {
  const { id } = context.params;
  const recipe = await fetchSingleRecipe(id as string);
  return {
    props: {
      ...(await serverSideTranslations(context.locale, [
        "header",
        "common",
        "recipe",
        "footer",
      ])),
      ...recipe,
    }
  };
};

const StyledArticle = styled.article`
  max-width: 1000px;
  width: 100%;
  margin: 2rem auto;
  padding: 0 2rem;
  box-sizing: border-box;
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 0px;
  padding-top: 60%;
  position: relative;
  border-radius: var(--rounded-lg);
  overflow: hidden;
  background: var(--color-background-alt);
`;

const RecipeStats = styled.header`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StyledHeading = styled.h2`
  font-size: 1.6rem;
  font-weight: 400;
  margin: 0 1rem 0 0;

  @media screen and (min-width: 800px) {
    font-size: 2rem;
  }
`;

const IconStat = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const SingleRecipe = ({
  name,
  steps,
  image,
  diet,
  cookTime,
  ingredients,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const DEFAULT_SERVINGS = 2;
  const [servings, setServings] = useState(DEFAULT_SERVINGS);
  function onServingsChanged(newServings: number) {
    setServings(newServings);
  }
  return (
    <>
      <PageTitle title={name} />
      <StyledArticle>
        <RecipeStats>
          <StyledHeading>{name}</StyledHeading>
          <IconStat>
            <Icon path={mdiClockOutline} size={1} title="Preparation Time" />
            <span>{cookTime}min</span>
          </IconStat>
          <IconForDiet diet={diet} />
        </RecipeStats>
        <ImageContainer>
          <Image
            src={`/img/recipes/${image || "placeholder-min.jpg"}`}
            layout="fill"
            objectFit="cover"
            sizes="(max-width: 400px) 400px, (max-width: 600px) 600px, (max-width: 800px) 800px, (min-width: 801px) 900px"
            alt=""
          />
        </ImageContainer>
        <ServingsChooser
          servings={servings}
          onServingsChanged={onServingsChanged}
        />
        <IngredientsList
          ingredients={ingredients}
          servingsMultiplier={servings / DEFAULT_SERVINGS}
        />
        <StepList steps={steps} />
      </StyledArticle>
    </>
  );
};

export default SingleRecipe;
