import { mdiClockOutline } from "@mdi/js";
import Icon from "@mdi/react";
import styles from "./DishCard.module.css";
import { useTranslations } from "next-intl";
import { Link } from "~/navigation";
import { type Recipe } from "~/models/Recipe";
import IconForDiet from "./DietIcon";
import DishImage from "./DishImage";
import TagSelect from "./TagSelect";

type Props = {
  recipe: Recipe;
};

const DishCard = ({
  recipe: { id, name, cookTime, diet, imageUrl, tags },
}: Props) => {
  const t = useTranslations("common");

  return (
    <Link href={`/r/${id}`}>
      <div className={styles.card}>
        <div className={styles.image}>
          <DishImage
            imageUrl={imageUrl}
            quality={80}
            sizes="(max-width: 600px) 200px, (max-width: 1200px) 400px, (max-width: 1800px) 500, (max-width: 2400px) 600px, (min-width: 2401px) 700px"
            alt=""
          />
        </div>
        <div className={styles.stats}>
          <h4 className={styles.name}>{name}</h4>
          <span className={styles.statLine}>
            <span className={styles.iconStat}>
              <Icon
                id={`preparationTime_${id}`}
                path={mdiClockOutline}
                size={1}
                title={t("preparationTime.label")}
              />
              <span>
                {t("preparationTime.inMinutes", { minutes: cookTime })}
              </span>
            </span>
            <IconForDiet id={`diet_${id}`} diet={diet} />
            <TagSelect
              values={tags}
              onlyShow
              instanceId={`${id}`}
              className={styles.tagSelect}
            />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default DishCard;
