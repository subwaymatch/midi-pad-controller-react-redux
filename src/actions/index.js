export const CHANGE_VOLUME = "CHANGE_VOLUME";

export const changeVolume = volume => ({
  type: CHANGE_VOLUME,
  payload: {
    volume
  }
});
