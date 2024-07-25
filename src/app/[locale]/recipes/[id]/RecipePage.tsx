import { mdiClockOutline, mdiLinkVariant } from "@mdi/js";
import Icon from "@mdi/react";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { type Recipe } from "~/models/Recipe";
import { Link } from "~/navigation";
import Heading from "../../_components/Heading";
import IconForDiet from "../../_components/recipe/DietIcon";
import DishImage from "../../_components/recipe/DishImage";
import IngredientsList from "../../_components/recipe/IngredientsList";
import StepList from "../../_components/recipe/StepList";
import TagSelect from "../../_components/recipe/TagSelect";

import styles from "./RecipePage.module.css";

interface Props {
  recipe: Recipe;
}

function truncate(str: string, n: number) {
  return str.length > n ? str.substring(0, n - 1) + "..." : str;
}

export default function RecipePage({ recipe }: Props) {
  const {
    id,
    name,
    imageUrl,
    servings,
    cookTime,
    diet,
    source,
    tags,
    ingredients,
    steps,
  } = recipe;
  const t = useTranslations("recipe");
  const displaySource = truncate(source, 20);

  return (
    <>
      <article className={styles.article}>
        <header className={styles.stats}>
          <Heading>{name}</Heading>
          <span className={styles.iconStat}>
            <Icon
              id={`preparationTime_${id}`}
              path={mdiClockOutline}
              size={1}
              title="Preparation Time"
            />
            <span>{cookTime}min</span>
          </span>
          <IconForDiet id={`diet_${id}`} diet={diet} />
          <span className={clsx(styles.iconStat, source ?? styles.hidden)}>
            <Icon path={mdiLinkVariant} size={1} />
            {source.startsWith("http") ? (
              <a href={source}>{displaySource}</a>
            ) : (
              <span title={source}>{displaySource}</span>
            )}
          </span>
          <TagSelect values={tags} onlyShow instanceId={id} />
        </header>
        <div></div>
        <div className={styles.image}>
          <DishImage
            imageUrl={imageUrl}
            sizes="(max-width: 400px) 400px, (max-width: 600px) 600px, (max-width: 800px) 800px, (min-width: 801px) 900px"
            alt=""
          />
        </div>
        <IngredientsList ingredients={ingredients} servings={servings} />
        <StepList steps={steps} />
        <div className={styles.linkContainer}>
          <Link href={`/recipes/${id}/edit`} className={styles.link}>
            {t("link.edit")}
          </Link>
          <Link href={`/recipes/${id}/delete`} className={styles.link}>
            {t("link.delete")}
          </Link>
        </div>
      </article>
    </>
  );
}
