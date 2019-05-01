import React, { Component } from "react";

import MidiControls from "./MidiControls"; 
import MidiPads from "./MidiPads";

class App extends Component {
  render() {
    return (
      <div id="app-wrapper">
        <MidiControls />
        <MidiPads />
      </div>
    );
  }
}

export default App;
