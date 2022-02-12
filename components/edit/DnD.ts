import { DragEventHandler, DragEvent, useCallback } from "react";

export type DnDConfig = {
  contextName: string;
  onDrop: (sourceIndex: number, targetIndex: number) => void;
};

type DnDProps = {
  draggable: boolean;
  onDragOver: DragEventHandler<HTMLDivElement>;
  onDragStart: DragEventHandler<HTMLDivElement>;
  onDrop: DragEventHandler<HTMLDivElement>;
}

export type ToDnDProps = (index: number) => DnDProps;

export function useDnD(config: DnDConfig): ToDnDProps {
  const onDragStart = useCallback((event: DragEvent<HTMLDivElement>, index: number) => {
    event.dataTransfer.setData("text/plain", config.contextName)
    event.dataTransfer.setData("number", index.toString());
    event.dataTransfer.effectAllowed = "move";
  }, [config]);

  const onDrop = useCallback((event: DragEvent<HTMLDivElement>, targetIndex: number) => {
    event.preventDefault();

    const contextName = event.dataTransfer.getData("text/plain");
    if (contextName !== config.contextName) {
      return;
    }

    const sourceIndex = parseInt(event.dataTransfer.getData("number"));
    config.onDrop(sourceIndex, targetIndex);
  }, [config]);

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  return (index: number): DnDProps => {
    return {
      draggable: true,
      onDragStart: (event) => onDragStart(event, index),
      onDrop: (event) => onDrop(event, index),
      onDragOver: onDragOver,
    }
  };
};
