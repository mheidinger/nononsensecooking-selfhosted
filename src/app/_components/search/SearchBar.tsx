"use client";

import { mdiMagnify } from "@mdi/js";
import Icon from "@mdi/react";
import debounce from "lodash/debounce";
import { useTranslations } from "next-intl";
import {
  type ChangeEvent,
  type FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { searchRecipes } from "~/actions";
import { type Recipe } from "~/models/Recipe";
import { usePathname, useRouter } from "~/navigation";
import SearchResult from "./SearchResult";

import ErrorNotification from "../ErrorNotification";
import styles from "./SearchBar.module.css";

export default function SearchBar() {
  const t = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(true);
  const [searchResults, setSearchResults] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetchSearchResults = useCallback(
    debounce(fetchSearchResults, 250, {
      maxWait: 1500,
    }),
    [],
  );

  useEffect(() => {
    setSearchResults([]);
    debouncedFetchSearchResults.cancel();
  }, [pathname, debouncedFetchSearchResults]);

  async function onChange(event: ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.target.value);
    const searchTerm = encodeURIComponent(event.target.value);

    await debouncedFetchSearchResults(searchTerm);
  }

  async function onFocus() {
    setIsOpen(true);
    if (searchTerm.length > 0) {
      await debouncedFetchSearchResults(searchTerm);
    }
  }

  async function fetchSearchResults(searchTerm: string) {
    console.log("Searching for", searchTerm);
    const result = await searchRecipes(searchTerm);

    if (
      !result?.data ||
      result?.validationErrors !== undefined ||
      result?.serverError !== undefined
    ) {
      setErrorMessage(result?.serverError ?? "Unknown error occured");
      setShowErrorMessage(true);
      return;
    }

    setSearchResults(result.data);
  }

  function onSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(`/search?query=${encodeURIComponent(searchTerm)}`);
    setSearchResults([]);
  }

  return (
    <div ref={containerRef}>
      <form method="GET" onSubmit={onSearch} className={styles.form}>
        <input
          placeholder={t("search.placeholder")}
          name="query"
          onChange={onChange}
          autoComplete="off"
          className={styles.input}
          onFocus={onFocus}
        />
        <button
          type="submit"
          value={t("search.action")}
          className={styles.button}
        >
          <Icon path={mdiMagnify} size={1} />
        </button>
        {searchResults.length > 0 && isOpen ? (
          <div className={styles.resultsContainer}>
            <ul className={styles.resultsList}>
              {searchResults.map((recipe) => (
                <SearchResult key={recipe.id} recipe={recipe} />
              ))}
            </ul>
          </div>
        ) : null}
      </form>
      <ErrorNotification
        message={errorMessage}
        show={showErrorMessage}
        onHide={() => setShowErrorMessage(false)}
      />
    </div>
  );
}
