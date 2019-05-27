import React, { Component } from "react";
import { connect } from "react-redux";
import { Tooltip } from "react-tippy";
import "react-tippy/dist/tippy.css";
import audioSrcData from "../data/audio-src";
import ButtonColorSelect from "./ButtonColorSelect";
import { closeButtonEditSidebar } from "../actions";
import { changeButtonColor, changeButtonSound } from "../actions";

const classnames = require("classnames");

class PadButtonEditBox extends Component {
  constructor(props) {
    super(props);
    this.changeButtonColor = this.changeButtonColor.bind(this);
    this.handleAudioSrcSelect = this.handleAudioSrcSelect.bind(this);
    this.revertAudioSrc = this.revertAudioSrc.bind(this);
    this.close = this.close.bind(this);
  }

  changeButtonColor(newColor) {
    const { dispatchChangeButtonColor, padButtonEdit } = this.props;
    dispatchChangeButtonColor(padButtonEdit.btnIdx, newColor);
  }

  handleAudioSrcSelect(srcName) {
    const { dispatchChangeButtonSound, padButtonEdit } = this.props;

    const src = audioSrcData[srcName];

    dispatchChangeButtonSound(padButtonEdit.btnIdx, srcName);

    const audio = new Audio(src);
    audio.volume = this.props.volume;
    audio.play();
  }

  revertAudioSrc() {
    const { dispatchChangeButtonSound, padButtonEdit } = this.props;

    dispatchChangeButtonSound(padButtonEdit.btnIdx, padButtonEdit.srcName);
  }

  close() {
    const { dispatchCloseButtonEditSidebar } = this.props;

    dispatchCloseButtonEditSidebar();
  }

  render() {
    const { pads, padButtonEdit } = this.props;

    if (padButtonEdit === null) return null;

    const { btnIdx } = padButtonEdit;
    const originalColor = padButtonEdit.color;
    const originalSrcName = padButtonEdit.srcName;

    return (
      <div id="pad-button-edit-box">
        <ButtonColorSelect
          color={pads[btnIdx].color}
          originalColor={originalColor}
          changeButtonColor={this.changeButtonColor}
        />

        <div className="option-title">
          <label>Audio Source</label>

          {originalSrcName !== pads[btnIdx].srcName && (
            <div className="revert-button" onClick={this.revertAudioSrc}>
              <Tooltip
                animation="shift"
                duration={100}
                animateFill={false}
                hideOnClick={false}
                title={"Revert to " + originalSrcName}
                position="bottom"
                theme="dark"
              >
                <i className="icon ion-ios-undo" />
                <span>Revert</span>
              </Tooltip>
            </div>
          )}
        </div>
        <div id="audio-src-items">
          {Object.keys(audioSrcData).map(k => {
            const itemClassStr = classnames({
              item: true,
              selected: k === pads[btnIdx].srcName
            });

            return (
              <div
                key={k}
                className={itemClassStr}
                onClick={e => {
                  this.handleAudioSrcSelect(k);
                }}
              >
                <span>{k}</span>

                <div className="show-when-selected">
                  <i className="icon ion-md-checkmark" />
                </div>
              </div>
            );
          })}
        </div>

        <div id="action-buttons-wrapper">
          <button className="close-button" onClick={this.close}>
            <i className="icon ion-md-close" />
            Close
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  pads: state.pads,
  volume: state.volume,
  padButtonEdit: state.padButtonEdit
});

const mapDispatchToProps = dispatch => ({
  dispatchChangeButtonColor: (btnIdx, color) =>
    dispatch(changeButtonColor(btnIdx, color)),
  dispatchChangeButtonSound: (btnIdx, srcName) =>
    dispatch(changeButtonSound(btnIdx, srcName)),
  dispatchCloseButtonEditSidebar: () => dispatch(closeButtonEditSidebar())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PadButtonEditBox);
