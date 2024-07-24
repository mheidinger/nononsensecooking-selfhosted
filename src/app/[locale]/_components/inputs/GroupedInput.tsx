import clsx from "clsx";

import styles from "./GroupedInput.module.css";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  isDragHover?: boolean;
}

export default function GroupedInput({ className, children, ...props }: Props) {
  const finalClassName = clsx(
    styles.groupedInput,
    className,
  );

  return (
    <div {...props} className={finalClassName}>
      {children}
    </div>
  );
}
