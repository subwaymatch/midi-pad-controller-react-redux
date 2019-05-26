import React, { Component } from "react";
import { connect } from "react-redux";
import audioSrcData from "../data/audio-src";
import ButtonColorSelect from "./ButtonColorSelect";
import { closeButtonEditSidebar } from "../actions";

const classnames = require("classnames");

class PadButtonEditBox extends Component {
  constructor(props) {
    super(props);

    this.handleAudioSrcSelect = this.handleAudioSrcSelect.bind(this);
    this.close = this.close.bind(this);
  }

  handleAudioSrcSelect(srcName, src) {
    const audio = new Audio(src);
    audio.volume = this.props.volume;
    audio.play();
  }

  close() {
    const { dispatchCloseButtonEditSidebar } = this.props;

    dispatchCloseButtonEditSidebar();
  }

  render() {
    console.log(this.props.padButtonEdit);

    return (
      <div id="pad-button-edit-box">
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
            const itemClassStr = classnames({
              item: true,
              selected: k === "Clap Fat"
            });

            return (
              <div
                key={k}
                className={itemClassStr}
                onClick={e => {
                  this.handleAudioSrcSelect(k, audioSrcData[k]);
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
  volume: state.volume,
  padButtonEdit: state.padButtonEdit
});

const mapDispatchToProps = dispatch => ({
  dispatchCloseButtonEditSidebar: () => dispatch(closeButtonEditSidebar())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PadButtonEditBox);
