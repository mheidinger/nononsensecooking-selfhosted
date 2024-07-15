import clsx from "clsx";
import { type ButtonHTMLAttributes, type PropsWithChildren } from "react";

import styles from "./Button.module.css";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "add" | "remove";
}

export default function Button({
  variant,
  children,
  className,
  ...rest
}: PropsWithChildren<Props>) {
  return (
    <button
      {...rest}
      className={clsx(
        styles.button,
        variant === "add" && styles.addButton,
        variant === "remove" && styles.removeButton,
        className,
      )}
    >
      {children}
    </button>
  );
}
