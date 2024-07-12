import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";

const StyledFooter = styled.footer`
  margin-top: 2rem;
  padding: 1rem 2rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;

  @media screen and (max-width: 800px) {
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const StyledLink = styled(Link)`
  color: var(--color-primary);
  white-space: pre;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;

  @media screen and (max-width: 800px) {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
`;

const Footer = () => {
  const { t } = useTranslation("footer");
  const router = useRouter();

  const onToggleLanguageClick = (newLocale) => {
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: newLocale });
  };

  return (
    <StyledFooter>
      <Nav>
        <StyledLink
          href="https://github.com/mheidinger/nononsensecooking-selfhosted"
          rel="noopener"
        >
          GitHub
        </StyledLink>
        <StyledLink href="/create" prefetch={false}>
          {t("link.createRecipe")}
        </StyledLink>
      </Nav>
      <Nav>
        <StyledLink href="#" onClick={() => onToggleLanguageClick("en-US")}>
          en
        </StyledLink>
        <StyledLink href="#" onClick={() => onToggleLanguageClick("de-DE")}>
          de
        </StyledLink>
      </Nav>
    </StyledFooter>
  );
};

export default Footer;
