import { createSlice } from "@reduxjs/toolkit";
import { hydrateFromStorage } from "./actions";

/**
 * False until the saved layout has been read from localStorage.
 *
 * Work that depends on which samples a pad actually uses waits for this:
 * acting on the default layout first would fetch samples that the saved
 * layout immediately replaces.
 */
const hydratedSlice = createSlice({
  name: "hydrated",
  initialState: false,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(hydrateFromStorage, () => true);
  },
});

export default hydratedSlice.reducer;
