import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { DEFAULT_PADS } from "@/data/defaultPads";
import { isSampleName, SAMPLE_FILES, SAMPLE_NAMES, sampleUrl, shortSampleName } from "./samples";

describe("sample catalog", () => {
  it("has 99 uniquely named samples", () => {
    expect(SAMPLE_NAMES).toHaveLength(99);
    expect(new Set(Object.values(SAMPLE_FILES)).size).toBe(99);
  });

  it("ships every sample file with the app", () => {
    const missing = Object.values(SAMPLE_FILES).filter(
      (file) => !existsSync(path.join(process.cwd(), "public", "sounds", file)),
    );
    expect(missing).toEqual([]);
  });

  it("only maps default pads to samples that exist", () => {
    for (const pad of DEFAULT_PADS) {
      expect(isSampleName(pad.srcName)).toBe(true);
    }
  });

  it("rejects prototype keys and unknown names", () => {
    expect(isSampleName("constructor")).toBe(false);
    expect(isSampleName("toString")).toBe(false);
    expect(isSampleName("Kick Nope")).toBe(false);
    expect(isSampleName(42)).toBe(false);
  });
});

describe("sampleUrl", () => {
  it("points into public/sounds", () => {
    expect(sampleUrl("Clap 808")).toBe("/sounds/clap-808.wav");
  });

  it("throws for unknown samples instead of building a broken URL", () => {
    expect(() => sampleUrl("Nope")).toThrow(/Unknown sample/);
  });
});

describe("shortSampleName", () => {
  it.each([
    ["Hihat Acoustic01", "Hihat"],
    ["Clap 808", "Clap"],
    ["  Perc   Tambo ", "Perc"],
    ["Cowbell", "Cowbell"],
  ])("shortens %j to %j", (input, expected) => {
    expect(shortSampleName(input)).toBe(expected);
  });
});
