"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "~/navigation";
import styles from "./Footer.module.css";

export default function Footer() {
  const t = useTranslations("footer");
  const pathname = usePathname();

  return (
    <footer className={styles.footer}>
      <nav className={styles.nav}>
        <Link
          href="https://github.com/mheidinger/nononsensecooking-selfhosted"
          rel="noopener"
          className={styles.link}
        >
          GitHub
        </Link>
        <Link href="/create" className={styles.link}>
          {t("link.createRecipe")}
        </Link>
      </nav>
      <nav className={styles.nav}>
        <Link href={pathname} locale="en" className={styles.link}>
          en
        </Link>
        <Link href={pathname} locale="de" className={styles.link}>
          de
        </Link>
      </nav>
    </footer>
  );
}
