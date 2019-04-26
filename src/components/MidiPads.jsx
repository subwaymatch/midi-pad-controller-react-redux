import React, { Component } from "react";
import { connect } from "react-redux";

import PadButton from "./PadButton";

import "../stylesheets/midi-buttons.scss";

class MidiPads extends Component {
  render() {
    return (
      <div id="pad-buttons-wrapper">
        {this.props.pads.map((item, idx) => {
          return (
            <PadButton
              key={idx}
              display={item.display}
              keyboard={item.keyboard}
              color={item.color}
            />
          );
        })}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  pads: state.pads
});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MidiPads);
