import React, { Component } from "react";

import MidiControls from "./MidiControls";
import MidiPads from "./MidiPads";
import PadButtonEditBox from "./PadButtonEditBox";

class App extends Component {
  render() {
    return (
      <div id="app">
        <div id="midi-pad">
          <MidiControls />
          <MidiPads />
          <PadButtonEditBox />
        </div>
      </div>
    );
  }
}

export default App;
