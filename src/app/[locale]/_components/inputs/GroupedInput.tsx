import clsx from "clsx";

import styles from "./GroupedInput.module.css";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  draggable?: boolean;
  isDragHover?: boolean;
}

export default function GroupedInput({
  draggable,
  className,
  children,
  ...props
}: Props) {
  const finalClassName = clsx(
    styles.groupedInput,
    draggable && styles.grabCursor,
    className,
  );

  return (
    <div {...props} className={finalClassName}>
      {children}
    </div>
  );
}
