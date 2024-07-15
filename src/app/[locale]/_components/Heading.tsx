import { type PropsWithChildren } from "react";
import styles from "./Heading.module.css";

export default function Heading(
  props: PropsWithChildren<NonNullable<unknown>>,
) {
  return <h2 className={styles.heading}>{props.children}</h2>;
}
