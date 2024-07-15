"use client";

import chroma from "chroma-js";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import Select, { type MultiValue } from "react-select";
import Creatable from "react-select/creatable";
import stc from "string-to-color";
import getSelectStylesConfig from "./getSelectStylesConfig";

export type TagSelectValue = {
  label: string;
  value: string;
};

type Props = {
  options?: string[];
  values?: string[];
  onChange?: (values: MultiValue<TagSelectValue>) => void;
  creatable?: boolean;
  className?: string;
  onlyShow?: boolean;
  instanceId?: string;
};

function getTagColors(data: TagSelectValue) {
  const tagColor = stc(data.value);
  return {
    backgroundColor: tagColor,
    fontColor: chroma.contrast(tagColor, "black") > 4.5 ? "black" : "white",
  };
}

export default function TagSelect({
  options,
  values,
  onChange,
  creatable,
  className,
  onlyShow,
  instanceId,
}: Props) {
  const t = useTranslations("common");

  const selectOptions = useMemo(
    () =>
      options?.map((option) => ({
        label: option,
        value: option,
      })),
    [options],
  );

  const selectValues = useMemo(
    () =>
      values?.map((value) => ({
        label: value,
        value: value,
      })),
    [values],
  );

  const selectProps = {
    options: selectOptions,
    value: selectValues,
    onChange: onChange,
    styles: getSelectStylesConfig(onlyShow, getTagColors),
    isDisabled: onlyShow,
    instanceId,
    placeholder: creatable ? t("filter.tags-creatable") : t("filter.tags"),
  };

  return (
    <div className={className}>
      {creatable ? (
        <Creatable {...selectProps} isMulti />
      ) : (
        <Select {...selectProps} isMulti />
      )}
    </div>
  );
}
