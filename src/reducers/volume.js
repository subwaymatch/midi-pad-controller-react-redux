import { CHANGE_VOLUME } from "../actions";

const initialState = 0.8;

function volume(state = initialState, action) {
  switch (action.type) {
    case CHANGE_VOLUME:
      return action.payload.volume;
    default:
      return state;
  }
}

export default volume;
