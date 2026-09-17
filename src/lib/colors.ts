/**
 * The eight pad colors.
 *
 * `hex` is the pad's base color and `labelHex` the ink printed on it. A pad
 * face is a gradient that runs from a light tint of `hex` in the middle to
 * `hex` at the edge, and white text does not reach 4.5:1 against any of them,
 * so the labels are dark. `src/lib/colors.test.ts` holds that line.
 */
export const PAD_COLORS = [
  { id: "default", label: "Gray", hex: "#888888", labelHex: "#111111" },
  { id: "blue", label: "Blue", hex: "#0097f0", labelHex: "#111111" },
  { id: "orange", label: "Orange", hex: "#e64c00", labelHex: "#111111" },
  { id: "magenta", label: "Magenta", hex: "#f731ed", labelHex: "#111111" },
  { id: "lightgreen", label: "Light Green", hex: "#d2d900", labelHex: "#111111" },
  { id: "turquoise", label: "Turquoise", hex: "#01c6bd", labelHex: "#111111" },
  { id: "lightblue", label: "Light Blue", hex: "#64cbfa", labelHex: "#111111" },
  { id: "green", label: "Green", hex: "#01ac3c", labelHex: "#111111" },
] as const;

export type PadColor = (typeof PAD_COLORS)[number]["id"];

const byId = new Map<string, (typeof PAD_COLORS)[number]>(
  PAD_COLORS.map((color) => [color.id, color]),
);

export function isPadColor(value: unknown): value is PadColor {
  return typeof value === "string" && byId.has(value);
}

export function padColorHex(color: PadColor): string {
  return byId.get(color)?.hex ?? PAD_COLORS[0].hex;
}

/** Color of the text printed on a pad of this color. */
export function padLabelHex(color: PadColor): string {
  return byId.get(color)?.labelHex ?? PAD_COLORS[0].labelHex;
}

export function padColorLabel(color: PadColor): string {
  return byId.get(color)?.label ?? PAD_COLORS[0].label;
}
