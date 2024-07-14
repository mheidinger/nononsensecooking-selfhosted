import {type PropsWithChildren} from "react";
import styles from "./PaddedSection.module.css";
import clsx from "clsx";

type Props = {
  title?: string;
  narrow?: boolean;
  smallHeadings?: boolean;
};

export default function PaddedSection({
  title,
  children,
  narrow,
  smallHeadings,
}: PropsWithChildren<Props>) {
	return (
  <section className={clsx(styles.section, narrow && styles.sectionNarrow)}>
    {title ? <h3 className={clsx(styles.title, smallHeadings && styles.titleSmall)}>{title}</h3> : null}
    {children}
  </section>
);
}
