import {
  OPEN_BUTTON_EDIT_SIDEBAR,
  CLOSE_BUTTON_EDIT_SIDEBAR
} from "../actions";

const initialState = null;

function padButtonEdit(state = initialState, action) {
  switch (action.type) {
    case OPEN_BUTTON_EDIT_SIDEBAR:
      return action.payload;

    case CLOSE_BUTTON_EDIT_SIDEBAR:
      return initialState;

    default:
      return state;
  }
}

export default padButtonEdit;
