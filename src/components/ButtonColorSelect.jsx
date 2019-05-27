import React, { Component } from "react";
import chroma from "chroma-js";
import Select from "react-select";
import { Tooltip } from "react-tippy";
import "react-tippy/dist/tippy.css";

const colorOptions = [
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

const colorStyles = {
  control: styles => ({
    ...styles,
    backgroundColor: "transparent",
    borderColor: "#333",
    marginRight: "20px"
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

class ButtonColorSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: null
    };
    this.revert = this.revert.bind(this);
  }

  handleChange = selectedOption => {
    this.props.changeButtonColor(selectedOption.value);
  };

  revert() {
    const { changeButtonColor, originalColor } = this.props;
    changeButtonColor(originalColor);
  }

  render() {
    const { color, originalColor } = this.props;

    return (
      <div id="button-color-select-wrapper">
        <div className="option-title">
          <label>Button Color</label>

          {originalColor !== color && (
            <Tooltip
              animation="shift"
              duration={100}
              animateFill={false}
              hideOnClick={false}
              title={"Revert to " + originalColor}
              position="bottom"
              theme="dark"
            >
              <div className="revert-button" onClick={this.revert}>
                <i className="icon ion-ios-undo" />
                <span>Revert</span>
              </div>
            </Tooltip>
          )}
        </div>
        <Select
          value={colorOptions.find(c => c.value === color)}
          onChange={this.handleChange}
          label="Single select"
          options={colorOptions}
          styles={colorStyles}
        />
      </div>
    );
  }
}

export default ButtonColorSelect;
