"use client";

import { useEffect, useState } from "react";

import clsx from "clsx";
import styles from "./ErrorNotification.module.css";

type Props = {
  message?: string;
  show: boolean;
  onHide?: () => void;
};

const ErrorNotification = ({ message, show, onHide }: Props) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onHide) {
          onHide();
        }
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [show, onHide]);

  return (
    <div className={clsx(styles.notification, isVisible && styles.show)}>
      {message}
    </div>
  );
};

export default ErrorNotification;
