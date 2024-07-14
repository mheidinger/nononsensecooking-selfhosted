"use client";

import chroma from "chroma-js";
import Select, { type MultiValue, type StylesConfig } from "react-select";
import Creatable from "react-select/creatable";
import stc from "string-to-color";

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

function getTagColors(tag: string) {
  const tagColor = stc(tag);
  return {
    backgroundColor: tagColor,
    fontColor: chroma.contrast(tagColor, "black") > 4.5 ? "black" : "white",
  };
}

const TagSelect = ({
  options,
  values,
  onChange,
  creatable,
  className,
  onlyShow,
  instanceId,
}: Props) => {
  const selectOptions: TagSelectValue[] = options
    ? options.map((option) => ({ label: option, value: option }))
    : [];
  const selectValues: TagSelectValue[] = values
    ? values.map((value) => ({ label: value, value: value }))
    : [];

  /* eslint-disable @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument */
  const colorStyles: StylesConfig<TagSelectValue> = {
    multiValue: (styles, { data }) => {
      const colors = getTagColors(data.value);
      return {
        ...styles,
        backgroundColor: colors.backgroundColor,
        color: colors.fontColor,
        visibility: "visible",
      };
    },
    multiValueLabel: (styles, { data }) => ({
      ...styles,
      color: getTagColors(data.value).fontColor,
      padding: "6px",
      visibility: "visible",
    }),
    multiValueRemove: (styles) => ({
      ...styles,
      display: onlyShow ? "none" : "flex",
    }),
    container: (styles) => ({
      ...styles,
      visibility: onlyShow ? "hidden" : "visible",
    }),
    control: (styles) => ({
      ...styles,
      backgroundColor: "var(--color-background-alt)",
      border: "none",
    }),
    menu: (styles) => ({
      ...styles,
      backgroundColor: "var(--color-background-alt-solid)",
    }),
    option: (styles, state) => ({
      ...styles,
      backgroundColor: state.isFocused
        ? "var(--color-background)"
        : "var(--color-background-alt-solid)",
    }),
  };
  /* eslint-enable @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument */

  const selectProps = {
    options: selectOptions,
    value: selectValues,
    onChange: onChange,
    styles: colorStyles,
    isDisabled: onlyShow,
    instanceId,
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
};

export default TagSelect;
