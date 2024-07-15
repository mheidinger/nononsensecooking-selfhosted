import clsx from "clsx";

import styles from "./InputRow.module.css";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  headingRow?: boolean;
}

export default function InputRow({ headingRow, ...rest }: Props) {
  return (
    <div
      {...rest}
      className={clsx(styles.row, headingRow && styles.headingRow)}
    ></div>
  );
}
