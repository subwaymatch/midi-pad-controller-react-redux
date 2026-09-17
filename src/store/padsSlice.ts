import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { DEFAULT_PADS } from "@/data/defaultPads";
import type { PadColor } from "@/lib/colors";
import type { Pad } from "@/lib/pads";
import { hydrateFromStorage } from "./actions";

function defaultPads(): Pad[] {
  return DEFAULT_PADS.map((pad) => ({ ...pad }));
}

const padsSlice = createSlice({
  name: "pads",
  initialState: defaultPads,
  reducers: {
    padColorChanged(
      state,
      { payload }: PayloadAction<{ index: number; color: PadColor }>,
    ) {
      const pad = state[payload.index];
      if (pad) pad.color = payload.color;
    },
    padSampleChanged(
      state,
      { payload }: PayloadAction<{ index: number; srcName: string }>,
    ) {
      const pad = state[payload.index];
      if (pad) pad.srcName = payload.srcName;
    },
    padsReset() {
      return defaultPads();
    },
  },
  extraReducers(builder) {
    builder.addCase(hydrateFromStorage, (_state, { payload }) => payload.pads);
  },
});

export const { padColorChanged, padSampleChanged, padsReset } = padsSlice.actions;
export default padsSlice.reducer;
