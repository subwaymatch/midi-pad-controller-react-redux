import padMappings from "../data/pad-mappings";
import { CHANGE_BUTTON_COLOR, CHANGE_BUTTON_SOUND } from "../actions";
const _ = require("lodash");

function pads(state = padMappings, action) {
  let clonedState;

  switch (action.type) {
    case CHANGE_BUTTON_COLOR:
      clonedState = _.clone(state);
      clonedState[action.payload.btnIdx].color = action.payload.color;

      return clonedState;
    case CHANGE_BUTTON_SOUND:
      clonedState = _.clone(state);
      clonedState[action.payload.btnIdx].srcName = action.payload.srcName;

      return clonedState;
    default:
      return state;
  }
}

export default pads;
