import { describe, expect, it } from "vitest";
import { PAD_COLORS, padColorHex, padColorLabel, padLabelHex } from "./colors";

/**
 * Share of the pad color left in the lightest point of the pad face. The face
 * is `color-mix(in srgb, var(--pad) 35%, white)` at rest and 30% while the pad
 * is pressed; see `src/components/PadButton.module.css`.
 */
const LIGHTEST_FACE = 0.3;

function channels(hex: string): [number, number, number] {
  const value = Number.parseInt(hex.slice(1), 16);
  return [(value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff];
}

function relativeLuminance(rgb: readonly number[]): number {
  const [r, g, b] = rgb.map((channel) => {
    const ratio = channel / 255;
    return ratio <= 0.04045 ? ratio / 12.92 : ((ratio + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}

/** WCAG 2.x contrast ratio between two opaque colors. */
function contrastRatio(a: readonly number[], b: readonly number[]): number {
  const [light, dark] = [relativeLuminance(a), relativeLuminance(b)].sort(
    (x, y) => y - x,
  );
  return (light! + 0.05) / (dark! + 0.05);
}

/** `color-mix(in srgb, color <share>, white)`. */
function mixWithWhite(rgb: readonly number[], share: number): number[] {
  return rgb.map((channel) => channel * share + 255 * (1 - share));
}

describe("PAD_COLORS", () => {
  it.each(PAD_COLORS)(
    "$label has a label readable everywhere on the pad face",
    ({ hex, labelHex }) => {
      const ink = channels(labelHex);
      // The label crosses the whole gradient: the base color at the edge, the
      // lightest tint in the middle. Both ends have to clear WCAG AA.
      const edge = contrastRatio(ink, channels(hex));
      const face = contrastRatio(ink, mixWithWhite(channels(hex), LIGHTEST_FACE));

      expect(Math.min(edge, face)).toBeGreaterThanOrEqual(4.5);
    },
  );

  it("has unique ids and looks colors up by id", () => {
    const ids = PAD_COLORS.map((color) => color.id);
    expect(new Set(ids).size).toBe(ids.length);

    expect(padColorHex("turquoise")).toBe("#01c6bd");
    expect(padLabelHex("turquoise")).toBe("#111111");
    expect(padColorLabel("turquoise")).toBe("Turquoise");
  });
});
