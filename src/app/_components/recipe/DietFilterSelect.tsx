"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";
import Select, { components, type MultiValue } from "react-select";
import { Diet } from "~/models/Diet";
import getSelectStylesConfig from "./getSelectStylesConfig";

export type DietFilterSelectValue = {
  label: string;
  value: string;
};

type Props = {
  onChange?: (values: MultiValue<DietFilterSelectValue>) => void;
  className?: string;
  instanceId?: string;
};

export default function DietFilterSelect({
  onChange,
  className,
  instanceId,
}: Props) {
  const t = useTranslations("common");

  const dietFilterOptions: DietFilterSelectValue[] = useMemo(() => {
    return Diet.options.map((option) => ({
      value: option,
      label: t(`diet.selection.${option}`),
    }));
  }, [t]);

  return (
    <div className={className}>
      <Select
        options={dietFilterOptions}
        isMulti
        onChange={onChange}
        placeholder={t("filter.diet")}
        instanceId={instanceId}
        styles={getSelectStylesConfig<DietFilterSelectValue>()}
        components={{
          Input: (props) => (
            <components.Input {...props} aria-activedescendant={undefined} />
          ),
        }}
      />
    </div>
  );
}
