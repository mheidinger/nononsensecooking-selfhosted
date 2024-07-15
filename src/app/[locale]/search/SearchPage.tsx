import { useTranslations } from "next-intl";
import { type Recipe } from "~/models/Recipe";
import PaddedSection from "../_components/layout/PaddedSection";
import DishList from "../_components/recipe/DishList";
import SearchBar from "../_components/search/SearchBar";

import styles from "./SearchPage.module.css";

interface Props {
  searchTerm?: string;
  results: Recipe[];
  availableTags: string[];
}

export default function SearchPage({
  searchTerm,
  results,
  availableTags,
}: Props) {
  const t = useTranslations("common");

  if (!searchTerm) {
    return (
      <>
        <section className={styles.centered}>
          <p className={styles.notice}>{t("search.findrecipes")}</p>
          <SearchBar />
        </section>
      </>
    );
  }
  return (
    <>
      <PaddedSection title={t("search.sectiontitle", { searchTerm })}>
        <DishList recipes={results} availableTags={availableTags} />
      </PaddedSection>
    </>
  );
}
