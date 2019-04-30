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

    pads.forEach(item => console.log(audioSource[item.srcName]));

    this.setState({
      audios: pads.map(item => new Audio(audioSource[item.srcName]))
    });
  }

  playSound(idx) {
    const audio = this.state.audios[idx];

    console.log("playSound, audio=" + audio);

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
              keyboard={item.keyboard}
              color={item.color}
              onClick={() => this.playSound(idx)}
            />
          );
        })}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  audioSource: state.audioSource,
  pads: state.pads
});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MidiPads);
