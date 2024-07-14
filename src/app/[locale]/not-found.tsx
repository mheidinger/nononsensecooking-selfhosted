import { mdiArrowLeft, mdiGithub, mdiPotSteamOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Link } from "~/navigation";
import styles from "./not-found.module.css";

interface Props {
  params: { locale: string };
}

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: "common" });

  return {
    title: t("notfound.pagetitle"),
  };
}

export default function NotFound() {
  const t = useTranslations("common");

  return (
    <>
      <div className={styles.content}>
        <h2 className={styles.title}>{t("notfound.displaytitle")}</h2>
        <p className={styles.explanation}>{t("notfound.explanation")}</p>
        <nav className={styles.nav}>
          <Link href="/" className={styles.link}>
            <Icon path={mdiArrowLeft} size={1} />
            {t("notfound.links.home")}
          </Link>
          <Link href="/recipes" className={styles.link}>
            <Icon path={mdiPotSteamOutline} size={1} />
            {t("notfound.links.allrecipes")}
          </Link>
          <Link
            href="https://github.com/mheidinger/nononsensecooking-selfhosted/issues"
            className={styles.link}
          >
            <Icon path={mdiGithub} size={1} />
            {t("notfound.links.github")}
          </Link>
        </nav>
      </div>
    </>
  );
}
