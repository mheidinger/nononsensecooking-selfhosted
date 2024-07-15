import clsx from "clsx";

import styles from "./InputLabel.module.css";

interface Props extends React.LabelHTMLAttributes<HTMLLabelElement> {
  indent?: boolean;
  width?: string;
}

export default function InputLabel({
  indent,
  width,
  className,
  style,
  ...props
}: Props) {
  const finalClassName = clsx(styles.label, indent && styles.indent, className);

  const labelStyle = {
    ...(width && { width }),
    ...style,
  };

  return <label className={finalClassName} style={labelStyle} {...props} />;
}
