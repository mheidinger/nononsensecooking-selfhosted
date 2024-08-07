import { mdiClockOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { useTranslations } from "next-intl";
import { type Recipe } from "~/models/Recipe";
import { Link } from "~/navigation";
import IconForDiet from "./DietIcon";
import DishImage from "./DishImage";
import TagSelect from "./TagSelect";

import styles from "./DishListItem.module.css";

type Props = {
  recipe: Recipe;
};

const DishListItem = ({
  recipe: { id, name, cookTime, diet, imageUrl, tags },
}: Props) => {
  const t = useTranslations("common");

  return (
    <Link href={`/recipes/${id}`}>
      <div className={styles.container}>
        <div className={styles.image}>
          <DishImage
            imageUrl={imageUrl}
            quality={60}
            sizes="(max-width: 600px) 100px, (min-width: 601px) 160px"
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
                size={0.75}
                title={t("preparationTime.label")}
              />
              <span>
                {t("preparationTime.inMinutes", { minutes: cookTime })}
              </span>
            </span>
            <IconForDiet id={`diet_${id}`} diet={diet} size={0.75} />
            <TagSelect values={tags} onlyShow instanceId={id} />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default DishListItem;
