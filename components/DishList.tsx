import { useTranslation } from "next-i18next";
import { useMemo, useState } from "react";
import Select from "react-select";
import styled from "styled-components";
import { Diet, Recipe } from "../models/Recipe";
import DishListItem from "./DishListItem";

type Props = {
  recipes: Recipe[],
}

const Filters = styled.div`
	display: flex;
  width: 100%;
  margin-bottom: 1rem;
  gap: 1rem;
`;

const DietFilter = styled(Select)`
  width: 40%;
  z-index: 300;
`;

const List = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media screen and (min-width: 1000px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

interface DietFilterOption {
  value: string;
  label: string;
}

function DishList({ recipes }: Props) {
  const { t } = useTranslation("common");
  const [ dietFilter, setDietFilter ] = useState<string[]>([]);

  const dietFilterOptions = useMemo(() => {
    const options: DietFilterOption[] = [];
    for (const diet in Diet) {
      options.push({value: Diet[diet], label: diet});
    }
    return options;
  }, []);

  let filteredRecipes = recipes;
  if (dietFilter.length > 0) {
    filteredRecipes = recipes.filter((recipe) => dietFilter.findIndex((diet) => recipe.diet === diet) >= 0);
  }

  return (
    <>
      <Filters>
        <DietFilter
          options={dietFilterOptions}
          isMulti={true}
          onChange={(values: DietFilterOption[]) => setDietFilter(values.map((val) => val.value))}
          placeholder={t("all.filter.diet")}
        />
      </Filters>
      <List>
        {filteredRecipes
          .map((recipe: Recipe) => (
            <DishListItem
              key={recipe.id}
              {...recipe}
            />
          ))}
      </List>
    </>
  );
}

export default DishList;
