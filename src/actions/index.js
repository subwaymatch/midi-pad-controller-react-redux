export const CHANGE_VOLUME = "CHANGE_VOLUME";

export const changeVolume = volume => ({
  type: CHANGE_VOLUME,
  payload: {
    volume
  }
});

export const OPEN_BUTTON_EDIT_SIDEBAR = "OPEN_BUTTON_EDIT_SIDEBAR";

export const openButtonEditSidebar = btnIdx => ({
  type: OPEN_BUTTON_EDIT_SIDEBAR,
  payload: {
    btnIdx
  }
});

export const CLOSE_BUTTON_EDIT_SIDEBAR = "CLOSE_BUTTON_EDIT_SIDEBAR";

export const closeButtonEditSidebar = () => ({
  type: CLOSE_BUTTON_EDIT_SIDEBAR
});

export const CHANGE_BUTTON_COLOR = "CHANGE_BUTTON_COLOR";

export const changeButtonColor = (btnIdx, color) => ({
  type: CHANGE_BUTTON_COLOR,
  payload: {
    btnIdx,
    color
  }
});

export const CHANGE_BUTTON_SOUND = "CHANGE_BUTTON_SOUND";

export const changeButtonSound = (btnIdx, sound) => ({
  type: CHANGE_BUTTON_SOUND,
  payload: {
    btnIdx,
    sound
  }
});
