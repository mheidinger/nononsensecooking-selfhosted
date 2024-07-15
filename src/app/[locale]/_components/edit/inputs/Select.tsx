import clsx from "clsx";

import styles from "./Select.module.css";

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  grow?: number;
  width?: string;
}

export default function Select({
  grow,
  width,
  className,
  style,
  children,
  ...props
}: Props) {
  const selectClasses = clsx(styles.select, className);

  const selectStyle: React.CSSProperties = {
    ...(grow !== undefined && { flexGrow: grow }),
    ...(width && { width }),
    ...style,
  };

  return (
    <select {...props} className={selectClasses} style={selectStyle}>
      {children}
    </select>
  );
}
