import React, { Component } from "react";
import { connect } from "react-redux";
import MidiControls from "./MidiControls";
import MidiPads from "./MidiPads";
import PadButtonEditBox from "./PadButtonEditBox";

class App extends Component {
  render() {
    const { padButtonEdit } = this.props;
    return (
      <div id="app">
        <div id="midi-pad">
          <MidiControls />
          <MidiPads />
        </div>

        {padButtonEdit && <PadButtonEditBox />}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  padButtonEdit: state.padButtonEdit
});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
