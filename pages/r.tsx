import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import DishList from "../components/DishList";
import DishListItem from "../components/DishListItem";
import { PaddedSection } from "../components/PaddedSection";
import PageTitle from "../components/PageTitle";
import languageFrom from "../lib/languageFrom";
import { fetchRecipeIndex } from "../lib/recipes";
import { Recipe } from "../models/Recipe";

export const getStaticProps: GetStaticProps = async (context) => {
  const locale = languageFrom(context);
  const recipeIndex = await fetchRecipeIndex();

  return {
    props: {
      ...(await serverSideTranslations(context.locale, [
        "common",
        "footer",
        "header",
      ])),
      recipes: recipeIndex,
    },
  };
};

export default function Recipes({
  recipes,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { t } = useTranslation("common");

  return (
    <>
      <PageTitle title={t("home.allrecipes")} />
      <PaddedSection title={t("home.allrecipes")} smallHeadings>
        <DishList>
          {recipes
            .filter((r: Recipe) => !r.isDraft)
            .map((recipe: Recipe) => (
              <DishListItem
                key={recipe.id}
                id={recipe.id}
                {...recipe}
              />
            ))}
        </DishList>
      </PaddedSection>
    </>
  );
}
