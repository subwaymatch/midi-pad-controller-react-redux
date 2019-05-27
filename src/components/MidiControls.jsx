import React, { Component } from "react";
import { connect } from "react-redux";
import "rc-slider/assets/index.css";
import "rc-tooltip/assets/bootstrap.css";
import Tooltip from "rc-tooltip";
import Slider from "rc-slider";

import { changeVolume, resetAll, closeButtonEditSidebar } from "../actions";

const classnames = require("classnames");

const Handle = Slider.Handle;

class MidiControls extends Component {
  constructor(props) {
    super(props);

    this.handleVolumeChange = this.handleVolumeChange.bind(this);
    this.handleResetAll = this.handleResetAll.bind(this);
  }

  handleVolumeChange(values) {
    const { value, dragging, index, ...restProps } = values;

    this.props.dispatchChangeVolume(value / 100);

    return (
      <Tooltip
        prefixCls="rc-slider-tooltip"
        overlay={value}
        visible={dragging}
        placement="bottom"
        key={index}
      >
        <Handle value={value} {...restProps} />
      </Tooltip>
    );
  }

  handleResetAll() {
    const { dispatchResetAll, dispatchCloseButtonEditSidebar } = this.props;

    if (window.confirm("Reset all button options?")) {
      dispatchResetAll();
      dispatchCloseButtonEditSidebar();
    }
  }

  render() {
    const { volume } = this.props;

    const iconClassStr = classnames({
      icon: true,
      "ion-md-volume-off": volume === 0,
      "ion-md-volume-mute": volume > 0 && volume < 0.3,
      "ion-md-volume-low": volume >= 0.3 && volume < 0.6,
      "ion-md-volume-high": volume >= 0.6
    });

    return (
      <div id="midi-controls-wrapper">
        <div id="volume-control" className="control-section">
          <div className="icon-wrapper">
            <i className={iconClassStr} />
          </div>
          <Slider
            min={0}
            max={100}
            defaultValue={Math.round(volume * 100)}
            handle={this.handleVolumeChange}
            trackStyle={{
              backgroundColor: "#01c6bd"
            }}
            handleStyle={{
              borderColor: "#01c6bd"
            }}
          />
        </div>

        <div id="help-box-wrapper">
          <i id="help-icon" className="icon ion-md-help-circle" />

          <div id="help-box">
            <div className="help-item">
              <h4>Changing Sound/Color</h4>
              <p>Right click on a button to change its sound or color.</p>

              <span
                id="reset-all-button"
                className="button"
                onClick={this.handleResetAll}
              >
                <i className="icon ion-ios-refresh" />
                Reset to Default
              </span>
            </div>
            <div className="help-item">
              <h4>Playing with a Keyboard</h4>
              <p>The letters on each button is the keyboard shortcut.</p>
            </div>

            <a
              className="button"
              href="http://99sounds.org/drum-samples/"
              title="99Sounds Drum Samples"
            >
              <i className="icon ion-md-heart" />
              Audio files from{" "}
              <span style={{ fontWeight: "500" }}>99Sounds Drum Samples</span>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  volume: state.volume
});

const mapDispatchToProps = dispatch => ({
  dispatchChangeVolume: volume => dispatch(changeVolume(volume)),
  dispatchResetAll: () => dispatch(resetAll()),
  dispatchCloseButtonEditSidebar: () => dispatch(closeButtonEditSidebar())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MidiControls);
