"use client";

import { useState } from "react";
import { type Recipe } from "~/models/Recipe";
import DietFilterSelect from "./DietFilterSelect";
import DishListItem from "./DishListItem";
import TagSelect from "./TagSelect";

import styles from "./DishList.module.css";

type Props = {
  recipes: Recipe[];
  availableTags: string[];
};

export default function DishList({ recipes, availableTags }: Props) {
  const [dietFilter, setDietFilter] = useState<string[]>([]);
  const [tagFilter, setTagFilter] = useState<string[]>([]);

  let filteredRecipes = recipes;
  if (dietFilter.length > 0) {
    filteredRecipes = filteredRecipes.filter((recipe) =>
      dietFilter.includes(recipe.diet),
    );
  }
  if (tagFilter.length > 0) {
    filteredRecipes = filteredRecipes.filter((recipe) =>
      tagFilter.some((tag) => recipe.tags.includes(tag)),
    );
  }

  return (
    <>
      <div className={styles.filters}>
        <DietFilterSelect
          onChange={(values) => setDietFilter(values.map((val) => val.value))}
          instanceId="diet-filter"
          className={styles.filter}
        />
        <TagSelect
          options={availableTags}
          onChange={(values) => setTagFilter(values.map((val) => val.value))}
          instanceId="tag-filter"
          className={styles.filter}
        />
      </div>
      <div className={styles.list}>
        {filteredRecipes.map((recipe) => (
          <DishListItem key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </>
  );
}
