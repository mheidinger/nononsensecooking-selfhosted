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
  useMemo,
  useRef,
  useState,
} from "react";
import { searchRecipes } from "~/actions";
import { usePathname, useRouter } from "~/i18n/navigation";
import { type Recipe } from "~/models/Recipe";
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
  const [currentPath, setCurrentPath] = useState(pathname);

  const containerRef = useRef<HTMLFormElement | null>(null);
  const latestRequest = useRef<AbortController | null>(null);

  if (pathname !== currentPath) {
    setCurrentPath(pathname);
    setSearchResults([]);
  }

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

  const fetchSearchResults = useCallback(
    async (searchTerm: string, signal: AbortSignal) => {
      const result = await searchRecipes(searchTerm);

      // A newer query, navigation, submission, or unmount makes this response stale.
      if (signal.aborted) {
        return;
      }

      if (
        !result?.data ||
        result.validationErrors !== undefined ||
        result.serverError !== undefined
      ) {
        setErrorMessage(result?.serverError ?? "Unknown error occured");
        setShowErrorMessage(true);
        return;
      }

      setSearchResults(result.data);
    },
    [],
  );

  const debouncedFetchSearchResults = useMemo(
    () => debounce(fetchSearchResults, 250, { maxWait: 1500 }),
    [fetchSearchResults],
  );

  useEffect(() => {
    return () => {
      debouncedFetchSearchResults.cancel();
      latestRequest.current?.abort();
    };
  }, [pathname, debouncedFetchSearchResults]);

  function scheduleSearch(term: string) {
    latestRequest.current?.abort();
    const request = new AbortController();
    latestRequest.current = request;
    debouncedFetchSearchResults(term, request.signal);
  }

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    const term = event.target.value;
    setSearchTerm(term);
    scheduleSearch(term);
  }

  function onFocus() {
    setIsOpen(true);
    if (searchTerm.length > 0) {
      scheduleSearch(searchTerm);
    }
  }

  function onSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    debouncedFetchSearchResults.cancel();
    latestRequest.current?.abort();
    router.push(`/search?query=${encodeURIComponent(searchTerm)}`);
    setSearchResults([]);
  }

  return (
    <>
      <form
        method="GET"
        onSubmit={onSearch}
        className={styles.form}
        ref={containerRef}
      >
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
    </>
  );
}
