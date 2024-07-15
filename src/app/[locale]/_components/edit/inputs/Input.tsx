import clsx from "clsx";

import styles from "./Input.module.css";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  grow?: number;
}

export default function Input({
  grow,
  width,
  className,
  style,
  disabled,
  ...props
}: Props) {
  const finalClassName = clsx(
    styles.input,
    disabled ? styles.disabled : styles.enabled,
    className,
  );

  const inputStyle: React.CSSProperties = {
    ...(grow !== undefined && { flexGrow: grow }),
    ...(width && { width }),
    ...style,
  };

  return (
    <input
      className={finalClassName}
      style={inputStyle}
      disabled={disabled}
      {...props}
    />
  );
}
