import React from "react";
import chroma from "chroma-js";
import Select from "react-select";

const colourOptions = [
  { value: "default", label: "Gray", color: "#888888" },
  { value: "blue", label: "Blue", color: "#0097f0" },
  { value: "orange", label: "Orange", color: "#e64c00" },
  { value: "magenta", label: "Magenta", color: "#f731ed" },
  { value: "lightgreen", label: "Light Green", color: "#d2d900" },
  { value: "turquoise", label: "Turquoise", color: "#01c6bd" },
  { value: "lightblue", label: "Light Blue", color: "#64cbfa" },
  { value: "green", label: "Green", color: "#01ac3c" }
];

const dot = (color = "#ccc") => ({
  alignItems: "center",
  display: "flex",

  ":before": {
    backgroundColor: color,
    borderRadius: 10,
    content: '" "',
    display: "block",
    marginRight: 8,
    height: 10,
    width: 10
  }
});

const colourStyles = {
  control: styles => ({
    ...styles,
    backgroundColor: "transparent",
    borderColor: "#333"
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const color = chroma(data.color);
    return {
      ...styles,
      backgroundColor: isDisabled
        ? null
        : isSelected
        ? data.color
        : isFocused
        ? color.alpha(0.1).css()
        : null,
      color: isDisabled
        ? "#ccc"
        : isSelected
        ? chroma.contrast(color, "white") > 2
          ? "white"
          : "black"
        : data.color,
      cursor: isDisabled ? "not-allowed" : "default",

      ":active": {
        ...styles[":active"],
        backgroundColor:
          !isDisabled && (isSelected ? data.color : color.alpha(0.3).css())
      }
    };
  },
  input: styles => ({ ...styles, ...dot() }),
  placeholder: styles => ({ ...styles, ...dot() }),
  singleValue: (styles, { data }) => ({
    ...styles,
    ...dot(data.color),
    color: "white"
  }),
  indicatorSeparator: styles => ({ ...styles, backgroundColor: "#333" }),
  dropdownIndicator: styles => ({ ...styles, color: "white" })
};

export default () => (
  <div id="button-color-select-wrapper">
    <label>Button Color</label>
    <Select
      defaultValue={colourOptions[2]}
      label="Single select"
      options={colourOptions}
      styles={colourStyles}
    />
  </div>
);
