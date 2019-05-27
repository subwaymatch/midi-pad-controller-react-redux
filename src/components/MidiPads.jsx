import React, { Component } from "react";
import { connect } from "react-redux";
import { openButtonEditSidebar } from "../actions";
import PadButton from "./PadButton";

import "../stylesheets/midi-buttons.scss";
const _ = require("lodash");

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

  static getDerivedStateFromProps(props, state) {
    const { pads, audioSource } = props;
    const clonedState = _.clone(state);

    for (let i = 0; i < state.audios.length; i++) {
      if (audioSource[pads[i].srcName] !== state.audios[i].src) {
        clonedState.audios[i] = new Audio(audioSource[pads[i].srcName]);
      }
    }

    return clonedState;
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
    const { pads, padButtonEdit } = this.props;

    return (
      <div id="pad-buttons-wrapper">
        {pads.map((item, idx) => {
          return (
            <PadButton
              key={idx}
              idx={idx}
              srcName={item.srcName}
              shortcutKey={item.shortcutKey}
              color={item.color}
              isEditing={padButtonEdit && padButtonEdit.btnIdx === idx}
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
  padButtonEdit: state.padButtonEdit,
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
