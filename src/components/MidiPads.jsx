import React, { Component } from "react";
import { connect } from "react-redux";
import { openButtonEditSidebar } from "../actions";
import PadButton from "./PadButton";

import "../stylesheets/midi-buttons.scss";

class MidiPads extends Component {
  constructor(props) {
    super(props);

    this.state = {
      audios: []
    };

    this.playSound = this.playSound.bind(this);
    this.openEditSidebar = this.openEditSidebar.bind(this);
  }

  componentDidMount() {
    this.loadSounds();
  }

  loadSounds() {
    const { pads, audioSource } = this.props;

    this.setState({
      audios: pads.map(item => new Audio(audioSource[item.srcName]))
    });
  }

  playSound(btnIdx) {
    const audio = this.state.audios[btnIdx];

    if (!audio.ended) {
      audio.pause();
      audio.currentTime = 0;
    }

    audio.volume = this.props.volume;

    audio.play();
  }

  openEditSidebar(btnIdx) {
    const { pads, dispatchOpenButtonEditSidebar } = this.props;

    dispatchOpenButtonEditSidebar(
      btnIdx,
      pads[btnIdx].color,
      pads[btnIdx].srcName
    );
  }

  render() {
    return (
      <div id="pad-buttons-wrapper">
        {this.props.pads.map((item, idx) => {
          return (
            <PadButton
              key={idx}
              idx={idx}
              display={item.srcName}
              shortcutKey={item.shortcutKey}
              color={item.color}
              play={() => this.playSound(idx)}
              edit={() => this.openEditSidebar(idx)}
            />
          );
        })}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  audioSource: state.audioSource,
  pads: state.pads,
  volume: state.volume
});

const mapDispatchToProps = dispatch => ({
  dispatchOpenButtonEditSidebar: (btnIdx, color, srcName) =>
    dispatch(openButtonEditSidebar(btnIdx, color, srcName))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MidiPads);
