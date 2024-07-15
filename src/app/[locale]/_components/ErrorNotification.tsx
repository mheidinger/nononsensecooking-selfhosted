"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";

import styles from "./ErrorNotification.module.css";

type Props = {
  message?: string;
  show: boolean;
};

const ErrorNotification = ({ message, show }: Props) => {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (message && !shown) {
      setShown(true);
    }
  }, [message, shown]);

  return (
    <div
      hidden={!shown}
      className={clsx(styles.errorBox, show ? styles.fadeIn : styles.fadeOut)}
    >
      {message ? message : ""}
    </div>
  );
};

export default ErrorNotification;
