import { combineReducers } from "redux";
import pads from "./pads";
import audioSource from "./audioSource";
import volume from "./volume";

const rootReducer = combineReducers({
  pads,
  audioSource,
  volume
});

export default rootReducer;
