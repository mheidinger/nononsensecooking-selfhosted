"use client";

import { useEffect } from "react";

import styles from "./error.module.css";

interface Props {
  error: Error & { digest?: string };
}

export default function Error({ error }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={styles.content}>
      <h2 className={styles.title}>Sorry, something went wrong!</h2>
    </div>
  );
}
