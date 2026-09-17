import { createSlice } from "@reduxjs/toolkit";

/**
 * Whether tapping a pad opens its editor instead of playing it.
 *
 * Touch screens have no hover, so the per-pad edit buttons are hidden there;
 * this mode is the way in. It stays on until it is turned off again, so
 * several pads can be set up in a row.
 */
const editModeSlice = createSlice({
  name: "editMode",
  initialState: false,
  reducers: {
    editModeToggled: (state) => !state,
    editModeExited: () => false,
  },
});

export const { editModeToggled, editModeExited } = editModeSlice.actions;
export default editModeSlice.reducer;
