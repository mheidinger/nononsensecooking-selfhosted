import { mdiMinus, mdiPlus } from "@mdi/js";
import Icon from "@mdi/react";
import { useTranslations } from "next-intl";

import styles from "./ServingsChooser.module.css";

interface Props {
  count: number;
  label?: string;
  onServingsCountChanged: (newServings: number) => void;
}

const ServingsChooser = ({
  count,
  label,
  onServingsCountChanged: onServingsChanged,
}: Props) => {
  const t = useTranslations("recipe");
  return (
    <div className={styles.container}>
      <div className={styles.inputLine}>
        <button
          className={styles.iconButton}
          onClick={function () {
            onServingsChanged(Math.max(1, count - 1));
          }}
        >
          <Icon
            path={mdiMinus}
            size={1}
            title="Less servings"
            id="less-servings"
          />
        </button>

        <span className={styles.servings}>{count}</span>

        <button
          className={styles.iconButton}
          onClick={function () {
            onServingsChanged(count + 1);
          }}
        >
          <Icon
            path={mdiPlus}
            size={1}
            title="More servings"
            id="more-servings"
          />
        </button>
      </div>
      {label ? (
        <h5 className={styles.servingsLabel}>{label}</h5>
      ) : (
        <h5 className={styles.servingsLabel}>{t("servings")}</h5>
      )}
    </div>
  );
};

export default ServingsChooser;
