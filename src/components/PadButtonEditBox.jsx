import React, { Component } from "react";
import { connect } from "react-redux";
import Select from "react-select";
import audioSrcData from "../data/audio-src";

import ButtonColorSelect from "./ButtonColorSelect";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" }
];

class PadButtonEditBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedOption: null
    };
  }

  handleColorChange = selectedOption => {
    this.setState({ selectedOption });
    console.log(`Option selected:`, selectedOption);
  };

  render() {
    const { selectedColorOption } = this.state;
    return (
      <div id="pad-button-edit-box">
        <div id="name-shortcut-wrapper">
          <div id="display-name-input-wrapper">
            <label>Display Name</label>
            <input type="text" value="Ride" />
          </div>

          <div id="shortcut-input-wrapper">
            <label>Shortcut</label>
            <input type="text" value="e" />
          </div>
        </div>

        <ButtonColorSelect />

        <div id="audio-src-title">
          <label>Audio Source</label>
          <div className="revert-button">
            <i className="icon ion-ios-undo" />
            <span>Revert</span>
          </div>
        </div>
        <div id="audio-src-items">
          {Object.keys(audioSrcData).map(k => {
            return (
              <div key="k" className="item">
                {k}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PadButtonEditBox);
