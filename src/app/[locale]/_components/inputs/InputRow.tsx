import clsx from "clsx";

import { forwardRef } from "react";
import styles from "./InputRow.module.css";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  headingRow?: boolean;
}

function InputRow(
  { headingRow, ...rest }: Props,
  ref: React.Ref<HTMLDivElement>,
) {
  return (
    <div
      ref={ref}
      {...rest}
      className={clsx(styles.row, headingRow && styles.headingRow)}
    ></div>
  );
}

export default forwardRef(InputRow);
