import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { clampVolume, DEFAULT_VOLUME } from "@/lib/storage";
import { hydrateFromStorage } from "./actions";

/** Master volume from 0 (silent) to 1 (full). */
const volumeSlice = createSlice({
  name: "volume",
  initialState: DEFAULT_VOLUME,
  reducers: {
    volumeChanged(_state, { payload }: PayloadAction<number>) {
      return clampVolume(payload);
    },
  },
  extraReducers(builder) {
    builder.addCase(hydrateFromStorage, (_state, { payload }) => payload.volume);
  },
});

export const { volumeChanged } = volumeSlice.actions;
export default volumeSlice.reducer;
