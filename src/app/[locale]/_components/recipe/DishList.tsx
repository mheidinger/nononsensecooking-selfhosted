"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import Select, { type MultiValue, type StylesConfig } from "react-select";
import { Diet } from "~/models/Diet";
import { type Recipe } from "~/models/Recipe";
import DishListItem from "./DishListItem";
import TagSelect from "./TagSelect";

import styles from "./DishList.module.css";

type Props = {
  recipes: Recipe[];
  availableTags: string[];
};

interface DietFilterOption {
  value: string;
  label: string;
}

export default function DishList({ recipes, availableTags }: Props) {
  const t = useTranslations("common");
  const [dietFilter, setDietFilter] = useState<string[]>([]);
  const [tagFilter, setTagFilter] = useState<string[]>([]);

  const dietFilterOptions: DietFilterOption[] = useMemo(() => {
    return Diet.options.map((option) => ({
      value: option,
      label: t(`diet.selection.${option}`),
    }));
  }, [t]);

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

  const dietFilterStyle: StylesConfig<DietFilterOption, true> = {
    control: (styles) => ({
      ...styles,
      backgroundColor: "var(--color-background-alt)",
      border: "none",
    }),
    menu: (styles) => ({
      ...styles,
      backgroundColor: "var(--color-background-alt-solid)",
    }),
    option: (styles, state) => ({
      ...styles,
      backgroundColor: state.isFocused
        ? "var(--color-background)"
        : "var(--color-background-alt-solid)",
    }),
  };

  return (
    <>
      <div className={styles.filters}>
        <Select
          options={dietFilterOptions}
          isMulti
          onChange={(values: MultiValue<DietFilterOption>) =>
            setDietFilter(values.map((val) => val.value))
          }
          placeholder={t("all.filter.diet")}
          instanceId={"diet-filter"}
          styles={dietFilterStyle}
          className={styles.filter}
        />
        <TagSelect
          options={availableTags}
          values={tagFilter}
          onChange={(values) => setTagFilter(values.map((val) => val.value))}
          instanceId={"tag-filter"}
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
