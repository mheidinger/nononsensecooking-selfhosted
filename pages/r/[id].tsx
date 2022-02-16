import { mdiClockOutline, mdiLinkVariant } from "@mdi/js";
import Icon from "@mdi/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useState } from "react";
import styled from "styled-components";
import DishImage from "../../components/DishImage";
import IconForDiet from "../../components/IconForDiet";
import IngredientsList from "../../components/IngredientsList";
import PageTitle from "../../components/PageTitle";
import ServingsChooser from "../../components/ServingsChooser";
import StepList from "../../components/StepList";
import { StyledHeading } from "../../components/StyledHeading";
import {
  fetchSingleRecipe, getRecipeImageUrl,
} from "../../lib/recipes";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;
  const recipe = await fetchSingleRecipe(id as string);
  const s3Url = await getRecipeImageUrl(id as string);
  const lang = context.locale ? context.locale : "en-US";

  return {
    props: {
      ...(await serverSideTranslations(lang, [
        "header",
        "common",
        "recipe",
        "footer",
      ])),
      ...recipe,
      s3Url,
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

const IconStat = styled.span`
  display: ${props => props.hidden ? "none" : "flex"};
  align-items: center;
  gap: 0.25rem;
`;

function truncate(str: string, n: number){
  return (str.length > n) ? str.substring(0, n-1) + "..." : str;
};

const SingleRecipe = ({
  id,
  name,
  steps,
  diet,
  cookTime,
  ingredients,
  source,
  s3Url,
  servings,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [currentServingsCount, setServingsCount] = useState(servings.count);
  const displaySource = truncate(source, 20);
  return (
    <>
      <PageTitle title={name} />
      <StyledArticle>
        <RecipeStats>
          <StyledHeading>{name}</StyledHeading>
          <IconStat>
            <Icon id={`preparationTime_${id}`} path={mdiClockOutline} size={1} title="Preparation Time" />
            <span>{cookTime}min</span>
          </IconStat>
          <IconForDiet id={`diet_${id}`} diet={diet} />
          <IconStat hidden={source === ""}>
            <Icon path={mdiLinkVariant} size={1} />
            {source.startsWith("http") ?
              <a href={source}>{displaySource}</a> :
              <span title={source}>{displaySource}</span>
            }
          </IconStat>
        </RecipeStats>
        <div>
        </div>
        <ImageContainer>
          <DishImage
            s3Url={s3Url}
            layout="fill"
            objectFit="cover"
            sizes="(max-width: 400px) 400px, (max-width: 600px) 600px, (max-width: 800px) 800px, (min-width: 801px) 900px"
            alt=""
          />
        </ImageContainer>
        <ServingsChooser
          count={currentServingsCount}
          label={servings.label}
          onServingsCountChanged={setServingsCount}
        />
        <IngredientsList
          ingredients={ingredients}
          servingsMultiplier={currentServingsCount / servings.count}
        />
        <StepList steps={steps} />
      </StyledArticle>
    </>
  );
};

export default SingleRecipe;
