import { useTranslation } from "next-i18next";
import { useEffect, useRef, DragEvent, useCallback } from "react";
import { AddButton, GroupedInput, InputLabel, InputRow, RemoveButton, StepInput } from "./Inputs";
import autosize from "autosize";
import Icon from "@mdi/react";
import { mdiClose, mdiDrag } from "@mdi/js";

type Props = {
  steps: string[];
  setSteps(steps: string[]): void;
};

const Steps = ({steps, setSteps}: Props) => {
  const { t: tr } = useTranslation("recipe");
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
  };

  function removeStep(index: number) {
    steps.splice(index, 1);
    setSteps(steps);
  };

  const onDragStart = useCallback((event: DragEvent<HTMLDivElement>, index: number) => {
    event.dataTransfer.setData("number", index.toString());
    event.dataTransfer.effectAllowed = "move";
  }, []);

  const onDrop = useCallback((event: DragEvent<HTMLDivElement>, targetIndex: number) => {
    event.preventDefault();

    const sourceIndex = parseInt(event.dataTransfer.getData("number"));
    const [removed] = steps.splice(sourceIndex, 1);
    steps.splice(targetIndex, 0, removed);
    setSteps(steps);
  }, [steps, setSteps]);

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  return (
    <>
      <InputRow headingRow><InputLabel>{tr("edit.steps")}</InputLabel></InputRow>
      {steps.map((step, index) =>
        <InputRow key={`step${index}`}>
          <InputLabel indent>#{index+1}:</InputLabel>
          <GroupedInput
            draggable={true}
            onDragOver={onDragOver}
            onDragStart={(event) => onDragStart(event, index)}
            onDrop={(event) => onDrop(event, index)}
            width="90%"
          >
            <Icon path={mdiDrag} size={1.4} />
            <StepInput
              name={`step${index}`}
              value={step}
              onChange={event => setStep(event.target.value, index)}
              ref={ref => {
                textAreaRefs.current[index] = ref;
              }}
            />
            <RemoveButton onClick={() => removeStep(index)}>
              <Icon path={mdiClose} size={0.8} />
            </RemoveButton>
          </GroupedInput>
        </InputRow>)
      }
      <InputRow><AddButton
        onClick={() => setSteps([...steps, ""])}
      >
        {tr("edit.addStep")}
      </AddButton></InputRow>
    </>
  );
};

export default Steps;
