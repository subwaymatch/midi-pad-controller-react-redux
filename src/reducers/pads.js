import padMappings from "../data/pad-mappings";
import { CHANGE_BUTTON_COLOR, CHANGE_BUTTON_SOUND } from "../actions";
const _ = require("lodash");

function pads(state = padMappings, action) {
  let clonedState;

  switch (action.type) {
    case CHANGE_BUTTON_COLOR:
      clonedState = _.clone(state);
      clonedState[this.action.payload.btnIdx].color = this.action.payload.color;

      return clonedState;
    case CHANGE_BUTTON_SOUND:
      clonedState = _.clone(state);
      clonedState[
        this.action.payload.btnIdx
      ].srcName = this.action.payload.srcName;

      return clonedState;
    default:
      return state;
  }
}

export default pads;
