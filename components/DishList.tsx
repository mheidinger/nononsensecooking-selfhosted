import { useTranslation } from "next-i18next";
import { useMemo, useState } from "react";
import Select from "react-select";
import styled from "styled-components";
import { Diet, Recipe } from "../models/Recipe";
import DishListItem from "./DishListItem";
import TagSelect, { TagSelectValue } from "./TagSelect";

type Props = {
  recipes: Recipe[],
  availableTags: string[],
}

const Filters = styled.div`
	display: flex;
  width: 100%;
  margin-bottom: 1rem;
  gap: 1rem;
  flex-wrap: wrap;
`;

const DietFilter = styled(Select)`
  width: 40%;
  z-index: 300;
  min-width: 300px;
`;

const TagFilter = styled(TagSelect)`
  width: 40%;
  z-index: 300;
  min-width: 300px;
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

function DishList({ recipes, availableTags }: Props) {
  const { t } = useTranslation("common");
  const [ dietFilter, setDietFilter ] = useState<string[]>([]);
  const [ tagFilter, setTagFilter ] = useState<string[]>([]);

  const dietFilterOptions = useMemo(() => {
    const options: DietFilterOption[] = [];
    for (const diet in Diet) {
      options.push({value: Diet[diet], label: diet});
    }
    return options;
  }, []);

  let filteredRecipes = recipes;
  if (dietFilter.length > 0) {
    filteredRecipes = filteredRecipes.filter((recipe) => dietFilter.includes(recipe.diet));
  }
  if (tagFilter.length > 0) {
    filteredRecipes = filteredRecipes.filter((recipe) => tagFilter.some(tag => recipe.tags.includes(tag)))
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
        <TagFilter
          options={availableTags}
          values={tagFilter}
          onChange={values => setTagFilter(values.map((val) => val.value))}
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
