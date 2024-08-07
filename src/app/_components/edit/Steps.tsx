"use client";

import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { nanoid } from "nanoid";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import Button from "../inputs/Button";
import InputLabel from "../inputs/InputLabel";
import InputRow from "../inputs/InputRow";
import Step from "./Step";

interface Props {
  initialSteps?: string[];
  onStepsUpdated: (steps: string[]) => void;
}

interface StepWithID {
  id: string;
  text: string;
}

export default function Steps({
  initialSteps: intialSteps,
  onStepsUpdated,
}: Props) {
  const t = useTranslations("recipe");

  const [steps, setSteps] = useState<StepWithID[]>([]);

  useEffect(() => {
    if (!intialSteps) {
      setSteps([{ id: nanoid(), text: "" }]);
    } else {
      setSteps(intialSteps.map((text) => ({ id: nanoid(), text })));
    }
  }, [intialSteps]);

  useEffect(() => {
    onStepsUpdated(steps.map((step) => step.text));
  }, [steps, onStepsUpdated]);

  function updateStep(id: string, newStepText: string) {
    setSteps(function (prevSteps) {
      return prevSteps.map((item) =>
        item.id === id ? { ...item, text: newStepText } : item,
      );
    });
  }

  function addStep() {
    setSteps((prevSteps) => [...prevSteps, { id: nanoid(), text: "" }]);
  }

  function removeStep(id: string) {
    setSteps((prevItems) => prevItems.filter((item) => item.id !== id));
  }

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const oldIndex = steps.findIndex((step) => step.id === active.id);
        const newIndex = steps.findIndex((step) => step.id === over.id);

        const newSteps = Array.from(steps);
        const [reorderedStep] = newSteps.splice(oldIndex, 1);
        newSteps.splice(newIndex, 0, reorderedStep!);

        setSteps(newSteps);
      }
    },
    [steps],
  );

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <InputRow headingRow>
        <InputLabel>{t("edit.steps")}</InputLabel>
      </InputRow>
      <>
        <SortableContext items={steps}>
          {steps.map(({ id, text }, index) => (
            <Step
              key={id}
              id={id}
              index={index}
              stepText={text}
              updateStep={(newStepText) => updateStep(id, newStepText)}
              removeStep={() => removeStep(id)}
            />
          ))}
        </SortableContext>

        <InputRow>
          <Button variant="add" onClick={addStep}>
            {t("edit.addStep")}
          </Button>
        </InputRow>
      </>
    </DndContext>
  );
}
