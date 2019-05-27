import padMappings from "../data/pad-mappings";
import PersistentStorage from "../data/PersistentStorage";
import {
  CHANGE_BUTTON_COLOR,
  CHANGE_BUTTON_SOUND,
  RESET_ALL
} from "../actions";
const _ = require("lodash");

const initialState = PersistentStorage.loadPadMappings();
const originalState = _.cloneDeep(padMappings);

function pads(state = initialState, action) {
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
    case RESET_ALL:
      return originalState;
    default:
      return state;
  }
}

export default pads;
