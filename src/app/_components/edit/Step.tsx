"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { mdiClose } from "@mdi/js";
import Icon from "@mdi/react";
import TextareaAutosize from "react-textarea-autosize";
import Button from "../inputs/Button";
import GroupedInput from "../inputs/GroupedInput";
import InputLabel from "../inputs/InputLabel";
import InputRow from "../inputs/InputRow";

import DragHandle from "./DragHandle";
import styles from "./Step.module.css";

interface Props {
  id: string;
  index: number;
  stepText: string;
  updateStep: (stepText: string) => void;
  removeStep: () => void;
}

export default function Step({
  id,
  index,
  stepText,
  updateStep,
  removeStep,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    setActivatorNodeRef,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <InputRow ref={setNodeRef} style={style} {...attributes}>
      <DragHandle ref={setActivatorNodeRef} {...listeners} />
      <GroupedInput>
        <InputLabel indent width="3%">
          #{index + 1}:
        </InputLabel>
        <TextareaAutosize
          name={`step${index}`}
          value={stepText}
          onChange={(event) => updateStep(event.target.value)}
          className={styles.step}
        />
        <Button variant="remove" onClick={() => removeStep()}>
          <Icon path={mdiClose} size={0.8} />
        </Button>
      </GroupedInput>
    </InputRow>
  );
}
