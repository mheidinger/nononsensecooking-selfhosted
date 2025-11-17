import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { mdiClose } from "@mdi/js";
import Icon from "@mdi/react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { type Ingredient as IngredientModel } from "~/models/Ingredient";
import { Unit } from "~/models/Unit";
import Button from "../inputs/Button";
import GroupedInput from "../inputs/GroupedInput";
import Input from "../inputs/Input";
import InputRow from "../inputs/InputRow";
import Select from "../inputs/Select";
import DragHandle from "./DragHandle";

interface Props {
  id: string;
  index: number;
  ingredient: IngredientModel;
  updateIngredient: (newIngredient: IngredientModel) => void;
  removeIngredient: () => void;
}

export default function Ingredient({
  id,
  index,
  ingredient,
  updateIngredient,
  removeIngredient,
}: Props) {
  const t = useTranslations("recipe");

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

  const unitOptions = useMemo(() => {
    return Unit.options.map((option) => (
      <option value={option} key={option}>
        {t(`unit.${option}`, { amount: "" }).trim()}
      </option>
    ));
  }, [t]);

  return (
    <InputRow ref={setNodeRef} style={style} {...attributes}>
      <GroupedInput>
        <DragHandle ref={setActivatorNodeRef} {...listeners} />
        <Input
          type="number"
          name={`ingredient${index}Amount`}
          value={
            ingredient.amount && ingredient.unit !== Unit.enum.none
              ? ingredient.amount
              : ""
          }
          disabled={ingredient.unit === Unit.enum.none}
          onKeyDown={(e) => {
            // Block non-numeric keys except navigation/editing keys
            if (e.key.length === 1 && !/[0-9]/.test(e.key)) {
              e.preventDefault();
            }
          }}
          onChange={(event) => {
            const value = event.currentTarget.value;
            if (value.length > 0) {
              const numValue = parseInt(value, 10);
              if (!isNaN(numValue) && numValue > 0) {
                updateIngredient({
                  ...ingredient,
                  amount: numValue,
                });
              }
            } else {
              updateIngredient({ ...ingredient, amount: undefined });
            }
          }}
          width="20%"
        />
        <Select
          id={`ingredient${index}Unit`}
          value={ingredient.unit ?? Unit.enum.none}
          onChange={(event) =>
            updateIngredient({
              ...ingredient,
              unit: event.currentTarget.value as Unit,
            })
          }
          width="20%"
        >
          {unitOptions}
        </Select>
        <Input
          name={`ingredient${index}Name`}
          value={ingredient.name}
          onChange={(event) =>
            updateIngredient({ ...ingredient, name: event.currentTarget.value })
          }
          width="60%"
        />
        <Button variant="remove" onClick={removeIngredient}>
          <Icon path={mdiClose} size={0.8} />
        </Button>
      </GroupedInput>
    </InputRow>
  );
}
