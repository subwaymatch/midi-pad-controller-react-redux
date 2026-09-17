/**
 * The eight pad colors.
 *
 * A pad face is a gradient that runs from a light tint of `hex` in the middle
 * to `hex` at the edge, and the label printed on it is white. The lighter
 * colors do not give white text much contrast, so the label carries a dark
 * shadow for separation; see `src/components/PadButton.module.css`.
 */
export const PAD_COLORS = [
  { id: "default", label: "Gray", hex: "#888888" },
  { id: "blue", label: "Blue", hex: "#0097f0" },
  { id: "orange", label: "Orange", hex: "#e64c00" },
  { id: "magenta", label: "Magenta", hex: "#f731ed" },
  { id: "lightgreen", label: "Light Green", hex: "#d2d900" },
  { id: "turquoise", label: "Turquoise", hex: "#01c6bd" },
  { id: "lightblue", label: "Light Blue", hex: "#64cbfa" },
  { id: "green", label: "Green", hex: "#01ac3c" },
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

export function padColorLabel(color: PadColor): string {
  return byId.get(color)?.label ?? PAD_COLORS[0].label;
}
