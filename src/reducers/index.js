import { combineReducers } from "redux";
import pads from "./pads";
import audioSource from "./audioSource";
import volume from "./volume";
import padButtonEdit from "./padButtonEdit";

const rootReducer = combineReducers({
  pads,
  audioSource,
  volume,
  padButtonEdit
});

export default rootReducer;
