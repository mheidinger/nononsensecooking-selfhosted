import { type PropsWithChildren } from "react";

import styles from "./Heading.module.css";

export default function Heading({
  children,
}: PropsWithChildren<NonNullable<unknown>>) {
  return <h2 className={styles.heading}>{children}</h2>;
}
