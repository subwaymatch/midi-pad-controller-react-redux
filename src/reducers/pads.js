import padMappings from "../data/pad-mappings";
import { CHANGE_BUTTON_COLOR, CHANGE_BUTTON_SOUND } from "../actions";

function pads(state = padMappings, action) {
  switch (action.type) {
    case CHANGE_BUTTON_COLOR:
      return state;
    case CHANGE_BUTTON_SOUND:
      return state;
    default:
      return state;
  }
}

export default pads;
