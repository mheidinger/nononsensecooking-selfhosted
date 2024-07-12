import { mdiArrowLeft, mdiGithub, mdiPotSteamOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import styled from "styled-components";
import PageTitle from "../components/PageTitle";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const lang = locale ? locale : "en-US";
  return {
    props: {
      ...(await serverSideTranslations(lang, ["common", "header", "footer"])),
    },
  };
};

const NotFoundPage = styled.div`
  max-width: 700px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const IntroParagraph = styled.p`
  max-width: 70ch;
  line-height: 1.6;
  color: var(--color-text-secondary);
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-size: 2rem;
`;

const LinkContainer = styled.nav`
  gap: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-wrap: wrap;
`;

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: var(--rounded);
  color: var(--color-text-secondary);
  transition: color 0.1s linear;

  &:hover {
    color: var(--color-primary);
  }
`;

export default function NotFound({}: InferGetStaticPropsType<
  typeof getStaticProps
>) {
  const { t } = useTranslation("common");
  return (
    <>
      <PageTitle title={t("notfound.pagetitle")} />
      <NotFoundPage>
        <Title>{t("notfound.displaytitle")}</Title>
        <IntroParagraph>{t("notfound.explanation")}</IntroParagraph>
        <LinkContainer>
          <StyledLink href="/">
            <Icon path={mdiArrowLeft} size={1} />
            {t("notfound.links.home")}
          </StyledLink>
          <StyledLink href="/r">
            <Icon path={mdiPotSteamOutline} size={1} />
            {t("notfound.links.allrecipes")}
          </StyledLink>
          <StyledLink href="https://github.com/mheidinger/nononsensecooking-selfhosted/issues">
            <Icon path={mdiGithub} size={1} />
            {t("notfound.links.github")}
          </StyledLink>
        </LinkContainer>
      </NotFoundPage>
    </>
  );
}
