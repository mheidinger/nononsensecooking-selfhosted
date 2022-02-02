import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import styled from "styled-components";
import DishList from "../components/DishList";
import DishListItem from "../components/DishListItem";
import { PaddedSection } from "../components/PaddedSection";
import SearchBar from "../components/SearchBar";
import { queryParam } from "../lib/queryParameter";
import { sanitize, searchRecipes } from "./api/search";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const unsanitizedSearchTerm = queryParam("query").from(context);
  if (!unsanitizedSearchTerm) {
    return {
      props: {
        searchTerm: "",
        results: [],
        ...(await serverSideTranslations(context.locale, [
          "common",
          "header",
          "footer",
        ])),
      },
    };
  }
  const searchTerm = sanitize(unsanitizedSearchTerm);
  const results = await searchRecipes(searchTerm);
  return {
    props: {
      searchTerm,
      results,
      ...(await serverSideTranslations(context.locale, [
        "common",
        "header",
        "footer",
      ])),
    },
  };
};

const Notice = styled.p`
  text-align: center;
  font-size: 1.5rem;
`;

const CenteredSection = styled.section`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  max-width: 700px;
  margin: 25vh auto 0 auto;
  padding: 0 2rem;
  box-sizing: border-box;
`;

export default function Search({
  searchTerm,
  results,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { t } = useTranslation("common");
  const { t: th } = useTranslation("header");
  if (!searchTerm) {
    return (
      <>
        <CenteredSection>
          <Notice>{t("search.findrecipes")}</Notice>
          <SearchBar placeholder={th("searchbar.placeholder")} />
        </CenteredSection>
      </>
    );
  }
  return (
    <>
      <PaddedSection title={t("search.sectiontitle", { searchTerm })}>
        <DishList>
          {results?.map(({ item: recipe }) => (
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
