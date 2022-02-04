import Link from "next/link";
import styled from "styled-components";
import { Recipe } from "../models/Recipe";
import IconForDiet from "./IconForDiet";

const StyledLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

interface Props {
  name: string;
  id: string;
  diet: Recipe["diet"];
}

function getHref(id: string) {
  return `/r/${id}`;
}

const StyledLi = styled.li`
  margin: 1rem 0;
`;

const SearchResult = ({ id, name, diet }: Props) => (
  <StyledLi>
    <Link href={getHref(id)} passHref>
      <StyledLink>
        <IconForDiet id={id} diet={diet} />
        <span>{name}</span>
      </StyledLink>
    </Link>
  </StyledLi>
);

export default SearchResult;
