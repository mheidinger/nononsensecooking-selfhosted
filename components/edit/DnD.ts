import { DragEventHandler, DragEvent, useCallback } from "react";

export type DnDConfig = {
  contextName: string;
  onDrop: (sourceIndex: number, targetIndex: number) => void;
  effect?: "none" | "copy" | "link" | "move";
  hoverClass?: string;
};

type DnDProps = {
  draggable: boolean;
  onDragOver: DragEventHandler<HTMLDivElement>;
  onDragStart: DragEventHandler<HTMLDivElement>;
  onDrop: DragEventHandler<HTMLDivElement>;
  onDragEnter: DragEventHandler<HTMLDivElement>;
  onDragLeave: DragEventHandler<HTMLDivElement>;
};

export type ToDnDProps = (index: number) => DnDProps;

function extractContext(event: DragEvent<HTMLDivElement>): string {
  return event.dataTransfer.types[0];
}

function extractIndex(event: DragEvent<HTMLDivElement>): number {
  return parseInt(event.dataTransfer.getData(extractContext(event)));
}

export function useDnD(config: DnDConfig): ToDnDProps {
  const onDragStart = useCallback(
    (event: DragEvent<HTMLDivElement>, index: number) => {
      event.dataTransfer.setData(config.contextName, index.toString());
      event.dataTransfer.effectAllowed = config.effect ? config.effect : "move";
    },
    [config],
  );

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>, targetIndex: number) => {
      event.preventDefault();
      if (extractContext(event) !== config.contextName) {
        return;
      }

      if (config.hoverClass) {
        event.currentTarget.classList.remove(config.hoverClass);
      }

      config.onDrop(extractIndex(event), targetIndex);
    },
    [config],
  );

  const onDragOver = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = config.effect ? config.effect : "move";
    },
    [config],
  );

  const onDragEnter = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (extractContext(event) !== config.contextName) {
        return;
      }

      if (config.hoverClass) {
        event.currentTarget.classList.add(config.hoverClass);
      }
    },
    [config],
  );

  const onDragLeave = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (extractContext(event) !== config.contextName) {
        return;
      }

      if (config.hoverClass) {
        event.currentTarget.classList.remove(config.hoverClass);
      }
    },
    [config],
  );

  return (index: number): DnDProps => {
    return {
      draggable: true,
      onDragStart: (event) => onDragStart(event, index),
      onDrop: (event) => onDrop(event, index),
      onDragOver,
      onDragEnter,
      onDragLeave,
    };
  };
}
