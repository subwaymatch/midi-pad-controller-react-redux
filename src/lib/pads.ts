import type { PadColor } from "./colors";

/**
 * One pad in the 4x4 grid. Field names match the shape persisted to
 * localStorage by the original app so existing saved layouts still load.
 */
export interface Pad {
  /** Display name of the sample, a key of `src/data/samples.json`. */
  srcName: string;
  /** Keyboard key that triggers this pad (compared case-insensitively). */
  shortcutKey: string;
  color: PadColor;
}
