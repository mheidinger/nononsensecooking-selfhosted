"use client";

import { mdiChefHat, mdiMenu, mdiPotSteamOutline } from "@mdi/js";
import Icon from "@mdi/react";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "~/navigation";
import SearchBar from "./search/SearchBar";

import styles from "./Header.module.css";

export default function Header() {
  const t = useTranslations("header");
  const [menuOpen, setMenuOpen] = useState(false);

  function toggleMenu() {
    setMenuOpen(!menuOpen);
  }

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logoLink}>
        <div className={styles.logoIcon}>
          <Icon path={mdiChefHat} size={1.5} rotate={10} />
        </div>
        <h1 className={styles.logoHeading}>NoNonsenseCooking</h1>
      </Link>
      <button onClick={toggleMenu} className={styles.menuButton}>
        <Icon path={mdiMenu} size={1} />
      </button>
      <div className={clsx(styles.menu, menuOpen && styles.menuOpen)}>
        <nav className={styles.nav}>
          <Link href="/recipes" className={styles.navLink}>
            <Icon path={mdiPotSteamOutline} size={1} />
            <span>{t("link.allrecipes")}</span>
          </Link>
          <SearchBar />
        </nav>
      </div>
    </header>
  );
}
