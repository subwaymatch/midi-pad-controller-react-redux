import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import PersistentStorage from "./data/PersistentStorage";

import App from "./components/App";
import store from "./store";

import "reset-css";
import "./stylesheets/style.scss";

let currentVolume, currentPads;

function handleChange() {
  let previousVolume = currentVolume;
  currentVolume = store.getState().volume;

  console.log("previousVolume=" + previousVolume);
  console.log("currentValue=" + currentVolume);

  let previousPads = currentPads;
  currentPads = store.getState().pads;

  if (previousVolume !== currentVolume) {
    PersistentStorage.saveVolume(currentVolume);
  }

  if (previousPads !== currentPads) {
    PersistentStorage.savePadMappings(currentPads);
  }
}

const unsubscribe = store.subscribe(handleChange);
const rootElement = document.getElementById("root");
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
);
