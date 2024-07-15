import { type StylesConfig } from "react-select";

export interface SelectTagColors {
  backgroundColor: string;
  fontColor: string;
}

export default function getSelectStylesConfig<T>(
  onlyShow?: boolean,
  getTagColors?: (data: T) => SelectTagColors,
) {
  /* eslint-disable @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument */
  const stylesConfig: StylesConfig<T> = {
    input: (styles) => ({
      ...styles,
      color: "var(--color-text-primary)",
    }),
    valueContainer: (styles) => ({
      ...styles,
      paddingLeft: "1rem",
      cursor: onlyShow ? "default" : "text",
    }),
    multiValue: (styles, { data }) => {
      const colors = getTagColors?.(data);
      return {
        ...styles,
        backgroundColor: colors?.backgroundColor,
        color: colors?.fontColor,
        visibility: "visible",
      };
    },
    multiValueLabel: (styles, { data }) => ({
      ...styles,
      color: getTagColors?.(data).fontColor,
      padding: "6px",
      visibility: "visible",
      cursor: "default",
    }),
    multiValueRemove: (styles) => ({
      ...styles,
      display: onlyShow ? "none" : "flex",
      cursor: onlyShow ? "default" : "pointer",
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
    indicatorsContainer: (styles) => ({
      ...styles,
      cursor: "pointer",
    }),
  };
  /* eslint-enable @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument */

  return stylesConfig;
}
