import { GetServerSideProps, GetStaticProps, InferGetServerSidePropsType, InferGetStaticPropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import styled from "styled-components";
import ErrorNotification from "../../../components/edit/ErrorNotification";
import { Button } from "../../../components/Inputs";
import PageTitle from "../../../components/PageTitle";
import { deleteRecipe } from "../../../lib/client/upload";
import { fetchSingleRecipe } from "../../../lib/recipes";
import { useEffect, useState } from "react";

export const getServerSideProps: GetServerSideProps = async ({ locale, query }) => {
  const { id } = query;
  const recipe = await fetchSingleRecipe(id as string);

  const lang = locale ? locale : "en-US";
  return {
    props: {
      ...(await serverSideTranslations(lang, ["common", "header", "footer", "recipe"])),
      recipe,
    },
  };
};

const DeletePage = styled.div`
  max-width: 700px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
`;

const RecipeName = styled.p`
  font-size: 1.5rem;
`;

const Title = styled.h2`
  font-size: 2rem;
`;

const LinkBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-top: 3rem;
`;

const BackButton = styled(Button)`
  height: 3rem;
  width: 10rem;
`;

const DeleteButton = styled(Button)`
  height: 3rem;
  width: 10rem;
  background: #d94040;
`;

export default function DeleteRecipe({recipe}: InferGetServerSidePropsType<
  typeof getServerSideProps
>) {
  const { t } = useTranslation("common");
  const { t: tr } = useTranslation("recipe");
  const [ errorMessage, setErrorMessage ] = useState();
  const [ showErrorMessage, setShowErrorMessage ] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => setShowErrorMessage(false), 5000);
    }
  }, [errorMessage])

  function goBack() {
    router.push(`/r/${recipe.id}`);
  }

  async function delRecipe() {
    try {
      await deleteRecipe(recipe.id);
      router.push('/');
    } catch (error) {
      console.error(error);
      setErrorMessage(error.toString());
      setShowErrorMessage(true);
    }
  }

  return (
    <>
      <PageTitle title={t("delete.pagetitle")} />
      <DeletePage>
        <Title>{tr("delete.question")}</Title>
        <RecipeName>{recipe.name}</RecipeName>
        <LinkBox>
          <BackButton onClick={goBack}>{tr("delete.back")}</BackButton>
          <DeleteButton onClick={delRecipe}>{tr("delete.delete")}</DeleteButton>
        </LinkBox>
      </DeletePage>
      <ErrorNotification
        show={showErrorMessage}
        message={errorMessage}
      />
    </>
  );
}
