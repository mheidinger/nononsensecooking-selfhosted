import { mdiClockOutline, mdiLinkVariant } from "@mdi/js";
import Icon from "@mdi/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";
import DishImage from "../../components/DishImage";
import IconForDiet from "../../components/IconForDiet";
import IngredientsList from "../../components/IngredientsList";
import PageTitle from "../../components/PageTitle";
import ServingsChooser from "../../components/ServingsChooser";
import StepList from "../../components/StepList";
import { StyledHeading } from "../../components/StyledHeading";
import TagSelect from "../../components/TagSelect";
import {
  fetchSingleRecipe,
  getRecipeImageUrl,
  invalidateCache,
} from "../../lib/recipes";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id, invalidate } = context.query;
  if (invalidate && invalidate === "true") {
    invalidateCache(id as string);
  }
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
    },
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
  flex-wrap: wrap;
`;

const IconStat = styled.span`
  display: ${(props) => (props.hidden ? "none" : "flex")};
  align-items: center;
  gap: 0.25rem;
`;

const LinkContainer = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
`;

const StyledLink = styled(Link)`
  color: var(--color-primary);
  white-space: pre;
`;

function truncate(str: string, n: number) {
  return str.length > n ? str.substring(0, n - 1) + "..." : str;
}

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
  tags,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t: tr } = useTranslation("recipe");
  const [currentServingsCount, setServingsCount] = useState(servings.count);
  const displaySource = truncate(source, 20);

  // Remove invalidate query from URL
  const router = useRouter();
  useEffect(() => {
    if (router.query.invalidate) {
      router.replace(`/r/${id}`, undefined, { scroll: false, shallow: true });
    }
  }, [id, router]);

  return (
    <>
      <PageTitle title={name} />
      <StyledArticle>
        <RecipeStats>
          <StyledHeading>{name}</StyledHeading>
          <IconStat>
            <Icon
              id={`preparationTime_${id}`}
              path={mdiClockOutline}
              size={1}
              title="Preparation Time"
            />
            <span>{cookTime}min</span>
          </IconStat>
          <IconForDiet id={`diet_${id}`} diet={diet} />
          <IconStat hidden={source === ""}>
            <Icon path={mdiLinkVariant} size={1} />
            {source.startsWith("http") ? (
              <a href={source}>{displaySource}</a>
            ) : (
              <span title={source}>{displaySource}</span>
            )}
          </IconStat>
          <TagSelect values={tags} onlyShow instanceId={id} />
        </RecipeStats>
        <div></div>
        <ImageContainer>
          <DishImage
            imageUrl={s3Url}
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
        <LinkContainer>
          <StyledLink href={`/r/${id}/edit`} prefetch={false}>
            {tr("link.edit")}
          </StyledLink>
          <StyledLink href={`/r/${id}/delete`} prefetch={false}>
            {tr("link.delete")}
          </StyledLink>
        </LinkContainer>
      </StyledArticle>
    </>
  );
};

export default SingleRecipe;
