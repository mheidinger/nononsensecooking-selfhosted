import { mdiDrag } from "@mdi/js";
import Icon from "@mdi/react";

import { forwardRef } from "react";
import styles from "./DragHandle.module.css";

function DragHandle(
  props: React.HTMLAttributes<HTMLButtonElement>,
  ref: React.Ref<HTMLButtonElement>,
) {
  return (
    <button ref={ref} className={styles.dragHandle} {...props}>
      <Icon path={mdiDrag} size={1.4} />
    </button>
  );
}

export default forwardRef(DragHandle);
