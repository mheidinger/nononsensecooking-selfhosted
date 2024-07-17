"use client";

import { mdiClose, mdiDrag } from "@mdi/js";
import Icon from "@mdi/react";
import autosize from "autosize";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef } from "react";
import Button from "../inputs/Button";
import GroupedInput from "../inputs/GroupedInput";
import InputLabel from "../inputs/InputLabel";
import InputRow from "../inputs/InputRow";
import { useDnD } from "./useDnD";

import styles from "./Steps.module.css";

type Props = {
  steps: string[];
  setSteps(steps: string[]): void;
};

export default function Steps({ steps, setSteps }: Props) {
  const t = useTranslations("recipe");
  const textAreaRefs = useRef<(HTMLTextAreaElement | null)[]>([]);

  useEffect(() => {
    for (const ref of textAreaRefs.current) {
      if (ref) {
        autosize(ref);
      }
    }
  }, [steps]);

  function setStep(step: string, index: number) {
    steps[index] = step;
    setSteps(steps);
  }

  function removeStep(index: number) {
    steps.splice(index, 1);
    setSteps(steps);
  }

  const onDrop = useCallback(
    (sourceIndex: number, targetIndex: number) => {
      const [removed] = steps.splice(sourceIndex, 1);
      if (!removed) {
        return;
      }
      steps.splice(targetIndex, 0, removed);
      setSteps(steps);
    },
    [steps, setSteps],
  );

  const toDnDProps = useDnD({
    contextName: "steps",
    hoverClass: "dragHover",
    onDrop,
  });

  return (
    <>
      <InputRow headingRow>
        <InputLabel>{t("edit.steps")}</InputLabel>
      </InputRow>
      {steps.map((step, index) => (
        <InputRow key={`step${index}`}>
          <InputLabel indent width="10%">
            #{index + 1}:
          </InputLabel>
          <GroupedInput {...toDnDProps(index)}>
            <Icon path={mdiDrag} size={1.4} />
            <textarea
              name={`step${index}`}
              value={step}
              onChange={(event) => setStep(event.target.value, index)}
              ref={(ref) => {
                textAreaRefs.current[index] = ref;
              }}
              className={styles.step}
            />
            <Button variant="remove" onClick={() => removeStep(index)}>
              <Icon path={mdiClose} size={0.8} />
            </Button>
          </GroupedInput>
        </InputRow>
      ))}
      <InputRow>
        <Button variant="add" onClick={() => setSteps([...steps, ""])}>
          {t("edit.addStep")}
        </Button>
      </InputRow>
    </>
  );
}
