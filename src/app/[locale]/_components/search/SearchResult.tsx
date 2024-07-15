import { type Recipe } from "~/models/Recipe";
import { Link } from "~/navigation";
import IconForDiet from "../recipe/DietIcon";
import styles from "./SearchResult.module.css";

interface Props {
  recipe: Recipe;
}

export default function SearchResult({ recipe }: Props) {
  const { id, name, diet } = recipe;

  return (
    <li className={styles.listItem}>
      <Link href={`/recipes/${id}`} className={styles.link}>
        <IconForDiet id={id} diet={diet} />
        <span>{name}</span>
      </Link>
    </li>
  );
}
