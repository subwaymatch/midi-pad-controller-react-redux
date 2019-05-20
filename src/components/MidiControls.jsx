import React, { Component } from "react";
import { connect } from "react-redux";
import "rc-slider/assets/index.css";
import "rc-tooltip/assets/bootstrap.css";
import Tooltip from "rc-tooltip";
import Slider from "rc-slider";

import { changeVolume } from "../actions";

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);
const Handle = Slider.Handle;

class MidiControls extends Component {
  constructor(props) {
    super(props);

    this.handleVolumeChange = this.handleVolumeChange.bind(this);
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

  render() {
    return (
      <div id="midi-controls-wrapper">
        <div id="volume-control" className="control-section">
          <i className="icon ion-ios-volume-high" />
          <Slider
            min={0}
            max={100}
            defaultValue={Math.round(this.props.volume * 100)}
            handle={this.handleVolumeChange}
          />
        </div>

        <div
          id="map-button-control"
          className="control-section clickable"
          onClick={() => {}}
        >
          <i className="icon ion-ios-settings" />
          <span>Change Sounds/Shortcuts</span>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  volume: state.volume
});

const mapDispatchToProps = dispatch => ({
  dispatchChangeVolume: volume => dispatch(changeVolume(volume))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MidiControls);