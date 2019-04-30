import { combineReducers } from "redux";
import pads from "./pads";
import audioSource from "./audioSource";

const rootReducer = combineReducers({
  pads,
  audioSource
});

export default rootReducer;
