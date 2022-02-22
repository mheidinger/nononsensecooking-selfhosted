import chroma from "chroma-js";
import Select, { StylesConfig } from "react-select";
import Creatable from 'react-select/creatable';
import stc from "string-to-color";

type TagSelectValue = {
  label: string;
  value: string;
}

type Props = {
  options?: string[];
  values?: string[];
  onChange?: (values: TagSelectValue[]) => void;
  creatable?: boolean;
  className?: string;
};

function getTagColors(tag: string) {
  const tagColor = stc(tag);
  return {
    backgroundColor: tagColor,
    fontColor: chroma.contrast(tagColor, "black") > 4.5 ? "black" : "white",
  };
}

const colorStyles: StylesConfig<TagSelectValue, true> = {
  multiValue: (styles, { data }) => {
    const colors = getTagColors(data.value);
    return {
      ...styles,
      backgroundColor: colors.backgroundColor,
      color: colors.fontColor,
    };
  },
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    color: getTagColors(data.value).fontColor,
  }),
};

const TagSelect = ({options, values, onChange, creatable, className}: Props) => {
  const selectOptions: TagSelectValue[] = options ? options.map((option) => ({label: option, value: option})) : [];
  const selectValues: TagSelectValue[] = values ? values.map((value) => ({label: value, value: value})) : [];

  const selectProps = {
    options: selectOptions,
    value: selectValues,
    onChange: onChange,
    isMulti: true,
    styles: colorStyles,
  };

  return (
    <div className={className}>
      { creatable ?
        <Creatable
          {...selectProps}
        /> :
        <Select
          {...selectProps}
        />
      }
    </div>
  );
};

export default TagSelect;
