import { useTranslation } from "next-i18next";
import Link from "next/link";
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

const StyledLink = styled.a`
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

  return (
    <StyledFooter>
      <Nav>
        <StyledLink
          href="https://github.com/mheidinger/nononsensecooking-selfhosted"
          rel="noopener"
        >
          GitHub
        </StyledLink>
        <Link href="/create" passHref prefetch={false}>
          <StyledLink>{t("link.createRecipe")}</StyledLink>
        </Link>
      </Nav>
    </StyledFooter>
  );
};

export default Footer;
