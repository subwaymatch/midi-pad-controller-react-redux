import { CHANGE_VOLUME } from "../actions";
import PersistentStorage from "../data/PersistentStorage";

const initialState = PersistentStorage.loadVolume();

function volume(state = initialState, action) {
  switch (action.type) {
    case CHANGE_VOLUME:
      return action.payload.volume;
    default:
      return state;
  }
}

export default volume;
