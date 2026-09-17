import { describe, expect, it } from "vitest";
import { PAD_COLORS, isPadColor, padColorHex, padColorLabel } from "./colors";

describe("PAD_COLORS", () => {
  it("has unique ids and looks colors up by id", () => {
    const ids = PAD_COLORS.map((color) => color.id);
    expect(new Set(ids).size).toBe(ids.length);

    expect(padColorHex("turquoise")).toBe("#01c6bd");
    expect(padColorLabel("turquoise")).toBe("Turquoise");
  });

  it("falls back to the first color for an unknown id", () => {
    expect(isPadColor("chartreuse")).toBe(false);
    expect(padColorHex("chartreuse" as never)).toBe(PAD_COLORS[0].hex);
    expect(padColorLabel("chartreuse" as never)).toBe(PAD_COLORS[0].label);
  });
});
