import React, { Component } from "react";
import { connect } from "react-redux";

import PadButton from "./PadButton";

import "../stylesheets/midi-buttons.scss";

class MidiPads extends Component {
  constructor(props) {
    super(props);

    this.state = {
      audios: []
    };

    this.playSound = this.playSound.bind(this);
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

  playSound(idx) {
    const audio = this.state.audios[idx];

    if (!audio.ended) {
      audio.pause();
      audio.currentTime = 0;
    }

    audio.volume = this.props.volume;

    audio.play();
  }

  render() {
    return (
      <div id="pad-buttons-wrapper">
        {this.props.pads.map((item, idx) => {
          return (
            <PadButton
              key={idx}
              display={item.display}
              shortcutKey={item.shortcutKey}
              color={item.color}
              play={() => this.playSound(idx)}
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

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MidiPads);
