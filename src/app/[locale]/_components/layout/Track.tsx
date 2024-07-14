import React, { type PropsWithChildren } from "react";
import styles from "./Track.module.css";

interface Props {
  sm: number;
  md?: number;
  lg?: number;
}

export default function Track({
  sm,
  md,
  lg,
  children,
}: PropsWithChildren<Props>) {
  // Prepare style object with CSS variables
  const style = {
    "--sm": sm,
    "--md": md ? md : "unset", // Use 'unset' to allow fallback to --sm if --md is not provided
    "--lg": lg ? lg : "unset", // Use 'unset' to allow fallback to --md or --sm if --lg is not provided
  } as React.CSSProperties;

  return (
    <div className={styles.track} style={style}>
      {children}
    </div>
  );
}
