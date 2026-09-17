import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { PadColor } from "@/lib/colors";

/**
 * Which pad the edit sidebar is open for, plus a snapshot of its settings at
 * the moment it was opened so the user can revert their changes.
 */
export interface EditorState {
  padIndex: number;
  originalColor: PadColor;
  originalSrcName: string;
}

const editorSlice = createSlice({
  name: "editor",
  initialState: null as EditorState | null,
  reducers: {
    editorOpened(_state, { payload }: PayloadAction<EditorState>) {
      return payload;
    },
    editorClosed() {
      return null;
    },
  },
});

export const { editorOpened, editorClosed } = editorSlice.actions;
export default editorSlice.reducer;
