import React, { Component } from "react";

import MidiControls from "./MidiControls";
import MidiPads from "./MidiPads";

class App extends Component {
  render() {
    return (
      <div id="app">
        <div id="midi-pad">
          <MidiControls />
          <MidiPads />
        </div>
      </div>
    );
  }
}

export default App;
